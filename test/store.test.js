import test from 'node:test';
import assert from 'node:assert/strict';
import '../core.js';
const {STORAGE_KEY,loadData,saveData,createInitialData,findPreviousSession}=globalThis.MMPCore;

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
test('rejects malformed backups and finds most recent exercise performance',()=>{
  const storage=new MemoryStorage();storage.setItem(STORAGE_KEY,'{"sessions":[]}');
  assert.equal(loadData(storage).sessions.length,0);
  const sessions=[{date:'2026-10-01',exercises:[{exerciseId:'x',sets:[{weight:20,reps:8,rir:2}]}]},{date:'2026-10-10',exercises:[{exerciseId:'x',sets:[{weight:22,reps:8,rir:1}]}]}];
  assert.equal(findPreviousSession(sessions,'x','2026-10-21').session.date,'2026-10-10');
});
