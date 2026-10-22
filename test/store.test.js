import test from 'node:test';
import assert from 'node:assert/strict';
import '../exercise-catalog.js';
import '../core.js';
const {STORAGE_KEY,loadData,saveData,createInitialData,defaultExercises,validateExerciseCatalog,finalizeSessionDraft,validateProfileDatabase,migrateToProfileDatabase,createProfile,syncBuiltInExerciseCatalog,loadProfileDatabase,saveProfileDatabase,findPreviousSession}=globalThis.MMPCore;

class MemoryStorage { constructor(){this.data=new Map()} getItem(k){return this.data.has(k)?this.data.get(k):null} setItem(k,v){this.data.set(k,String(v))} }

test('creates the sample three-day plans without inventing workout history',()=>{
  const data=loadData(new MemoryStorage());
  assert.deepEqual(data.plans.map(p=>p.day),['Monday','Wednesday','Friday']);
  assert.equal(data.sessions.length,0);
});
test('persists user workout data so a fresh load restores it',()=>{
  const storage=new MemoryStorage(),data=createInitialData();
  data.sessions.push({id:'s1',date:'2026-10-21',exercises:[{exerciseId:'base-0',sets:[{weight:55,reps:10,rir:2}]}]});
  saveData(data,storage);
  const restored=loadData(storage);
  assert.equal(restored.sessions[0].exercises[0].sets[0].weight,55);
  assert.ok(storage.getItem(STORAGE_KEY));
});
test('preserves saved sessions when routine and exercise details are edited',()=>{
  const storage=new MemoryStorage(),data=createInitialData();
  data.sessions.push({id:'s2',date:'2026-10-21',exercises:[{exerciseId:'base-0',sets:[{weight:55,reps:10,rir:2}]}]});
  data.plans[0].name='Updated routine';
  data.exercises[0].name='Updated exercise';
  saveData(data,storage);
  const restored=loadData(storage);
  assert.equal(restored.plans[0].name,'Updated routine');
  assert.equal(restored.exercises[0].name,'Updated exercise');
  assert.deepEqual(restored.sessions,data.sessions);
});
test('restores an active workout draft with edited, added, and removed sets',()=>{
  const storage=new MemoryStorage(),data=createInitialData();
  data.activeDraft={id:'draft-1',date:'2026-10-21',name:'Back & legs',notes:'Steady session',exercises:[{exerciseId:'base-0',sets:[{weight:'50',reps:10,rir:2},{weight:'55',reps:8,rir:2}]}]};
  saveData(data,storage);
  const resumed=loadData(storage);
  assert.equal(resumed.activeDraft.id,'draft-1');
  assert.equal(resumed.activeDraft.exercises[0].sets[1].weight,'55');
  resumed.activeDraft.exercises[0].sets[0].weight='52.5';
  resumed.activeDraft.exercises[0].sets.push({weight:'',reps:8,rir:2});
  resumed.activeDraft.exercises[0].sets.splice(1,1);
  saveData(resumed,storage);
  const restoredAgain=loadData(storage);
  assert.equal(restoredAgain.activeDraft.notes,'Steady session');
  assert.deepEqual(restoredAgain.activeDraft.exercises[0].sets,[{weight:'52.5',reps:10,rir:2},{weight:'',reps:8,rir:2}]);
});
test('finalizes a workout using only complete, valid sets',()=>{
  const draft={id:'draft-2',date:'2026-10-21',name:'Test session',notes:'Felt good',exercises:[
    {exerciseId:'base-0',sets:[{weight:'40',reps:'10',rir:'2'},{weight:'',reps:'8',rir:'2'},{weight:'bad',reps:'8',rir:'2'},{weight:'40',reps:'0',rir:'2'},{weight:'-1',reps:'8',rir:'2'}]},
    {exerciseId:'base-1',sets:[{weight:'0',reps:'12',rir:''},{weight:'10',reps:'8',rir:'99'}]}
  ]};
  const completed=finalizeSessionDraft(draft,'2026-10-21T18:00:00.000Z');
  assert.equal(completed.finishedAt,'2026-10-21T18:00:00.000Z');
  assert.equal(completed.notes,'Felt good');
  assert.deepEqual(completed.exercises,[
    {exerciseId:'base-0',sets:[{weight:40,reps:10,rir:2}]},
    {exerciseId:'base-1',sets:[{weight:0,reps:12,rir:0},{weight:10,reps:8,rir:0}]}
  ]);
  assert.equal(typeof draft.exercises[0].sets[0].weight,'string','finalizing should not mutate the active draft');
});
test('does not finalize a session without exercises or a valid logged set',()=>{
  assert.throws(()=>finalizeSessionDraft({exercises:[]}),/Add at least one exercise/);
  assert.throws(()=>finalizeSessionDraft({exercises:[{exerciseId:'base-0',sets:[{weight:'',reps:8,rir:2},{weight:'bad',reps:8,rir:2}]}]}),/Log at least one set/);
});
test('rejects malformed backups and finds most recent exercise performance',()=>{
  const storage=new MemoryStorage();storage.setItem(STORAGE_KEY,'{"sessions":[]}');
  assert.equal(loadData(storage).sessions.length,0);
  const sessions=[{date:'2026-10-01',exercises:[{exerciseId:'x',sets:[{weight:20,reps:8,rir:2}]}]},{date:'2026-10-10',exercises:[{exerciseId:'x',sets:[{weight:22,reps:8,rir:1}]}]}];
  assert.equal(findPreviousSession(sessions,'x','2026-10-21').session.date,'2026-10-10');
});
test('migrates version 1 workout data into the default profile without mutating it',()=>{
  const legacy=createInitialData();
  legacy.activeDraft={id:'draft-legacy',date:'2026-10-21',name:'Back & legs',exercises:[{exerciseId:'base-0',sets:[{weight:'52.5',reps:10,rir:2}]}]};
  legacy.sessions.push({id:'legacy-session',date:'2026-10-20',exercises:[{exerciseId:'base-0',sets:[{weight:50,reps:10,rir:2}]}]});
  const original=JSON.stringify(legacy);
  const migrated=migrateToProfileDatabase(legacy);
  assert.equal(migrated.version,2);
  assert.equal(migrated.activeProfileId,'profile-default');
  assert.equal(migrated.profiles.length,1);
  assert.equal(migrated.profiles[0].id,'profile-default');
  assert.equal(migrated.profiles[0].name,'Personal');
  assert.deepEqual(migrated.profiles[0].exercises,legacy.exercises);
  assert.deepEqual(migrated.profiles[0].plans,legacy.plans);
  assert.deepEqual(migrated.profiles[0].sessions,legacy.sessions);
  assert.deepEqual(migrated.profiles[0].activeDraft,legacy.activeDraft);
  assert.equal(JSON.stringify(legacy),original,'migration should not mutate version 1 data');
  assert.equal(validateProfileDatabase(migrated),true);
});
test('rejects invalid version 1 input and invalid profile envelopes',()=>{
  assert.throws(()=>migrateToProfileDatabase({version:1,exercises:[],plans:'bad',sessions:[]}),/not valid for profile migration/);
  const invalid={version:2,activeProfileId:'missing',profiles:[{id:'profile-default',name:'Personal',exercises:[],plans:[],sessions:[]}]};
  assert.equal(validateProfileDatabase(invalid),false);
  assert.throws(()=>migrateToProfileDatabase(invalid),/not valid for profile migration/);
});
test('loads version 1 data by migrating and persisting a preserving version 2 profile',()=>{
  const storage=new MemoryStorage(),legacy=createInitialData();legacy.sessions.push({id:'keep-me',date:'2026-10-20',exercises:[]});legacy.activeDraft={id:'draft-keep',exercises:[]};storage.setItem(STORAGE_KEY,JSON.stringify(legacy));
  const database=loadProfileDatabase(storage),saved=JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(database.version,2);assert.equal(database.profiles[0].name,'Personal');assert.deepEqual(database.profiles[0].sessions,legacy.sessions);assert.deepEqual(database.profiles[0].activeDraft,legacy.activeDraft);assert.equal(saved.version,2);
});
test('profile storage preserves separate histories and active drafts across reloads',()=>{
  const storage=new MemoryStorage(),personal=migrateToProfileDatabase(createInitialData());personal.profiles[0].sessions.push({id:'personal-session',date:'2026-10-21',exercises:[]});personal.profiles[0].activeDraft={id:'personal-draft',exercises:[]};const second=createProfile('profile-two','Second');second.sessions.push({id:'second-session',date:'2026-10-22',exercises:[]});personal.profiles.push(second);personal.activeProfileId=second.id;
  saveProfileDatabase(personal,storage);const restored=loadProfileDatabase(storage);
  assert.equal(restored.activeProfileId,'profile-two');assert.deepEqual(restored.profiles.map(p=>p.sessions.map(s=>s.id)),[['personal-session'],['second-session']]);assert.equal(restored.profiles[0].activeDraft.id,'personal-draft');assert.equal(restored.profiles[1].activeDraft,null);
});
test('creates fresh profiles with starter plans and no shared or saved workout data',()=>{
  const a=createProfile('a','Alex'),b=createProfile('b','Blair');a.plans[0].name='Changed only in Alex';a.exercises[0].name='Changed only in Alex';a.sessions.push({id:'a-session',date:'2026-10-21',exercises:[]});
  assert.equal(a.plans.length,3);assert.equal(b.plans[0].name,'Back & legs');assert.notEqual(a.exercises[0].name,b.exercises[0].name);assert.equal(b.sessions.length,0);assert.equal(b.activeDraft,null);
});
test('migration accepts legacy imports and full profile backups without mutating either',()=>{
  const legacy=createInitialData(),multi=migrateToProfileDatabase(legacy);multi.profiles.push(createProfile('other','Other'));const multiCopy=JSON.stringify(multi);
  const importedLegacy=migrateToProfileDatabase(legacy),importedMulti=migrateToProfileDatabase(multi);
  assert.equal(importedLegacy.profiles.length,1);assert.equal(importedMulti.profiles.length,2);assert.equal(JSON.stringify(multi),multiCopy);assert.equal(validateProfileDatabase(importedMulti),true);
});
test('exercise catalog has stable unique IDs and complete muscle, equipment, and rep metadata',()=>{
  assert.equal(validateExerciseCatalog(defaultExercises),true);
  assert.ok(defaultExercises.length>=80,'catalog should expand beyond the original 30 entries');
  assert.deepEqual(defaultExercises.slice(0,3).map(e=>e.id),['base-0','base-1','base-2'],'existing exercise IDs stay stable');
  assert.ok(defaultExercises.some(e=>e.equipment.includes('machine')));
  assert.ok(defaultExercises.some(e=>e.equipment.includes('cable')));
  assert.ok(defaultExercises.some(e=>e.equipment.includes('resistance-band')));
  assert.equal(validateExerciseCatalog([...defaultExercises,{...defaultExercises[0]}]),false,'duplicate IDs and names are rejected');
});
test('catalog sync upgrades legacy profiles without changing user edits, plans, history, or drafts',()=>{
  const legacy=createInitialData();legacy.exercises=legacy.exercises.slice(0,30).map(({primaryMuscles,secondaryMuscles,equipment,category,...old})=>old);legacy.exercises[0].name='My preferred pulldown';legacy.exercises.push({id:'custom-row',name:'My custom row',group:'Back',minReps:8,maxReps:12,builtIn:false});legacy.sessions.push({id:'saved-session',date:'2026-10-20',exercises:[{exerciseId:'base-0',sets:[{weight:50,reps:10,rir:2}]}]});legacy.activeDraft={id:'draft-stays',exercises:[{exerciseId:'base-0',sets:[{weight:'52.5',reps:8,rir:2}]}]};
  const before=migrateToProfileDatabase(legacy),snapshot=JSON.stringify(before),result=syncBuiltInExerciseCatalog(before),profile=result.database.profiles[0];
  assert.equal(result.changed,true);assert.equal(JSON.stringify(before),snapshot,'sync must not mutate the original database');assert.ok(profile.exercises.length>=defaultExercises.length+1);assert.equal(profile.exercises.find(e=>e.id==='base-0').name,'My preferred pulldown');assert.deepEqual(profile.exercises.find(e=>e.id==='base-0').primaryMuscles,['Lats']);assert.equal(profile.exercises.find(e=>e.id==='custom-row').name,'My custom row');assert.deepEqual(profile.exercises.find(e=>e.id==='custom-row').primaryMuscles,['Upper Back']);assert.deepEqual(profile.sessions,legacy.sessions);assert.equal(profile.activeDraft.id,'draft-stays');assert.deepEqual(profile.plans[0].exerciseIds,legacy.plans[0].exerciseIds);
  assert.equal(syncBuiltInExerciseCatalog(result.database).changed,false,'catalog sync should be idempotent after first update');
});
