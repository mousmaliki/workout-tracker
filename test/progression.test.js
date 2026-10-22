import test from 'node:test';
import assert from 'node:assert/strict';
import '../exercise-catalog.js';
import '../core.js';
const {recommendNext,estimatedOneRepMax}=globalThis.MMPCore;

test('starts without a previous session at the minimum rep target',()=>{
  assert.deepEqual(recommendNext([], {minReps:8,maxReps:12}),{weight:null,reps:8,action:'start',reason:'Start with a manageable weight and aim for 8 reps.'});
});
test('increases load only when every set reaches max reps with at least 2 RIR',()=>{
  const result=recommendNext([{weight:40,reps:12,rir:2},{weight:40,reps:12,rir:3}],{minReps:8,maxReps:12,increment:2.5});
  assert.equal(result.action,'increase');assert.equal(result.weight,42.5);assert.equal(result.reps,8);
});
test('holds load and suggests one more rep when a set is below range top or RIR is too low',()=>{
  const result=recommendNext([{weight:40,reps:12,rir:1},{weight:40,reps:10,rir:3}],{minReps:8,maxReps:12});
  assert.equal(result.action,'hold');assert.equal(result.weight,40);assert.deepEqual(result.reps,[12,11]);
});
test('caps next rep targets at max reps and estimates 1RM',()=>{
  assert.deepEqual(recommendNext([{weight:40,reps:12,rir:1}],{minReps:8,maxReps:12}).reps,[12]);
  assert.equal(estimatedOneRepMax(60,10),80);assert.equal(estimatedOneRepMax(0,10),0);
});
