import test from 'node:test';
import assert from 'node:assert/strict';
import '../exercise-catalog.js';
import '../core.js';
import '../exercise-guides.js';

const {defaultExercises}=globalThis.MMPCore;
const {exerciseGuide}=globalThis.LiftLabGuides;

test('every built-in exercise has a movement-specific coaching guide',()=>{
  for(const exercise of defaultExercises){
    const guide=exerciseGuide(exercise);
    assert.equal(guide.matched,true,`${exercise.name} should match a curated guide`);
    for(const field of ['description','setup','movement','watch'])
      assert.ok(typeof guide[field]==='string'&&guide[field].trim().length>12,`${exercise.name} needs ${field} guidance`);
  }
});

test('custom exercises receive a safe general fallback guide',()=>{
  const guide=exerciseGuide({name:'My custom movement',group:'Chest',equipment:['dumbbell']});
  assert.equal(guide.matched,false);
  assert.ok(guide.description&&guide.setup&&guide.movement&&guide.watch);
});
