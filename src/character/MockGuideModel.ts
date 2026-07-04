import * as THREE from "three";

/**
 * PROJECT NEXUS // MOCK GUIDE MODEL GENERATOR
 * Responsibility: Generates a stylized, procedural biped model representing
 * the Guide Character (young engineer with a holographic notebook) with a real
 * skeletal bone structure.
 * Creates procedural THREE.AnimationClips for all FSM states so that the
 * THREE.AnimationMixer and blending systems can run with full accuracy.
 */

export interface MockGuideModel {
  group: THREE.Group;
  mixer: THREE.AnimationMixer;
  clips: Record<string, THREE.AnimationClip>;
  notebookLight: THREE.PointLight;
}

export function createMockGuideModel(): MockGuideModel {
  const group = new THREE.Group();
  group.name = "guide-character-skeletal";

  // Create skeleton bones
  const rootBone = new THREE.Bone();
  rootBone.name = "root";
  rootBone.position.set(0, 0, 0);

  const spineBone = new THREE.Bone();
  spineBone.name = "spine";
  spineBone.position.set(0, 0.9, 0);
  rootBone.add(spineBone);

  const neckBone = new THREE.Bone();
  neckBone.name = "neck";
  neckBone.position.set(0, 0.5, 0);
  spineBone.add(neckBone);

  const headBone = new THREE.Bone();
  headBone.name = "head";
  headBone.position.set(0, 0.2, 0);
  neckBone.add(headBone);

  const leftShoulder = new THREE.Bone();
  leftShoulder.name = "left_shoulder";
  leftShoulder.position.set(-0.25, 0.45, 0);
  spineBone.add(leftShoulder);

  const rightShoulder = new THREE.Bone();
  rightShoulder.name = "right_shoulder";
  rightShoulder.position.set(0.25, 0.45, 0);
  spineBone.add(rightShoulder);

  const leftArm = new THREE.Bone();
  leftArm.name = "left_arm";
  leftArm.position.set(-0.1, -0.3, 0);
  leftShoulder.add(leftArm);

  const rightArm = new THREE.Bone();
  rightArm.name = "right_arm";
  rightArm.position.set(0.1, -0.3, 0);
  rightShoulder.add(rightArm);

  const leftLeg = new THREE.Bone();
  leftLeg.name = "left_leg";
  leftLeg.position.set(-0.15, -0.45, 0);
  rootBone.add(leftLeg);

  const rightLeg = new THREE.Bone();
  rightLeg.name = "right_leg";
  rightLeg.position.set(0.15, -0.45, 0);
  rootBone.add(rightLeg);

  // Notebook bone (held in right hand / front of chest)
  const notebookBone = new THREE.Bone();
  notebookBone.name = "notebook";
  notebookBone.position.set(0, 0.1, 0.3);
  spineBone.add(notebookBone);

  // Helper to create visual meshes representing the bones
  const addMesh = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const matBody = new THREE.MeshStandardMaterial({
    color: "#4f4f5f",
    roughness: 0.8,
    metalness: 0.2,
  });

  const matHead = new THREE.MeshStandardMaterial({
    color: "#dfcfbf",
    roughness: 0.6,
  });

  const matNotebook = new THREE.MeshStandardMaterial({
    color: "#2a2a2a",
    roughness: 0.5,
  });

  const matHolo = new THREE.MeshBasicMaterial({
    color: "#00e5ff",
    transparent: true,
    opacity: 0.7,
  });

  // Attach visual geometries to bones (representing the stylized engineer)
  // Pelvis / Root
  addMesh(rootBone, new THREE.BoxGeometry(0.35, 0.15, 0.25), matBody);
  // Chest / Spine
  const chestMesh = addMesh(spineBone, new THREE.BoxGeometry(0.4, 0.45, 0.25), matBody);
  chestMesh.position.set(0, -0.22, 0);
  // Head
  const headMesh = addMesh(headBone, new THREE.BoxGeometry(0.22, 0.22, 0.22), matHead);
  headMesh.position.set(0, 0.11, 0);
  // Limbs
  addMesh(leftShoulder, new THREE.BoxGeometry(0.1, 0.1, 0.1), matBody);
  const leftArmMesh = addMesh(leftArm, new THREE.BoxGeometry(0.08, 0.35, 0.08), matBody);
  leftArmMesh.position.set(0, -0.15, 0);

  addMesh(rightShoulder, new THREE.BoxGeometry(0.1, 0.1, 0.1), matBody);
  const rightArmMesh = addMesh(rightArm, new THREE.BoxGeometry(0.08, 0.35, 0.08), matBody);
  rightArmMesh.position.set(0, -0.15, 0);

  const leftLegMesh = addMesh(leftLeg, new THREE.BoxGeometry(0.1, 0.45, 0.1), matBody);
  leftLegMesh.position.set(0, -0.22, 0);

  const rightLegMesh = addMesh(rightLeg, new THREE.BoxGeometry(0.1, 0.45, 0.1), matBody);
  rightLegMesh.position.set(0, -0.22, 0);

  // Notebook (stylized holographic notebook)
  const notebookMesh = addMesh(notebookBone, new THREE.BoxGeometry(0.24, 0.02, 0.16), matNotebook);
  notebookMesh.position.set(0, 0, 0);

  // Holographic projection sheet emitting from notebook
  const holoMesh = addMesh(notebookBone, new THREE.PlaneGeometry(0.22, 0.14), matHolo);
  holoMesh.rotation.x = -Math.PI / 3;
  holoMesh.position.set(0, 0.08, 0.06);

  // Holographic Notebook local illumination point light
  const notebookLight = new THREE.PointLight("#00e5ff", 0, 3);
  notebookLight.position.set(0, 0.15, 0.1);
  notebookBone.add(notebookLight);

  // Add the root bone to the main group
  group.add(rootBone);

  // Position entire group slightly above ground
  rootBone.position.y = 0.9;

  // Initialize AnimationMixer
  const mixer = new THREE.AnimationMixer(group);

  // Create procedural tracks for each state
  const clips: Record<string, THREE.AnimationClip> = {};

  // 1. Idle (slow breathing, slight spine rotation)
  const idleTimes = [0, 2, 4];
  const idleSpineRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.02, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
  ];
  const idleTrack = new THREE.QuaternionKeyframeTrack("spine.quaternion", idleTimes, idleSpineRot);
  clips.idle = new THREE.AnimationClip("idle", 4, [idleTrack]);

  // 2. Reading (Look down at notebook, face lit, breathing slightly)
  const readHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.38, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
  ];
  const readHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    idleTimes,
    readHeadRot
  );
  clips.reading = new THREE.AnimationClip("reading", 4, [readHeadTrack]);

  // Page Turn (Right arm swings slightly, head dips and looks back down)
  const turnPageTimes = [0, 0.5, 1.0, 1.5];
  const turnPageArmRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, -0.4, 0.3)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, -0.2, 0.1)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
  ];
  const turnPageHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3, 0.1, 0.05)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, -0.05, -0.02)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
  ];
  const turnPageArmTrack = new THREE.QuaternionKeyframeTrack(
    "right_shoulder.quaternion",
    turnPageTimes,
    turnPageArmRot
  );
  const turnPageHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    turnPageTimes,
    turnPageHeadRot
  );
  clips.pageturn = new THREE.AnimationClip("pageturn", 1.5, [turnPageArmTrack, turnPageHeadTrack]);

  // 3. LookingUp (Transition from looking down to look up)
  const lookUpTimes = [0, 1.2];
  const lookUpHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
  ];
  const lookUpHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    lookUpTimes,
    lookUpHeadRot
  );
  clips.lookingup = new THREE.AnimationClip("lookingup", 1.2, [lookUpHeadTrack]);

  // 4. CloseNotebook (Tilt notebook down, arms fold down slightly)
  const closeTimes = [0, 0.8];
  const closeNotePos = [0, 0.1, 0.3, 0, -0.05, 0.25];
  const closeNoteRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)).toArray(),
  ];
  const closeNoteTrackPos = new THREE.VectorKeyframeTrack(
    "notebook.position",
    closeTimes,
    closeNotePos
  );
  const closeNoteTrackRot = new THREE.QuaternionKeyframeTrack(
    "notebook.quaternion",
    closeTimes,
    closeNoteRot
  );
  clips.closenotebook = new THREE.AnimationClip("closenotebook", 0.8, [
    closeNoteTrackPos,
    closeNoteTrackRot,
  ]);

  // 5. Smile (Breathing, look ahead, subtle face rotation/nod)
  const smileHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
  ];
  const smileHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    idleTimes,
    smileHeadRot
  );
  clips.smile = new THREE.AnimationClip("smile", 4, [smileHeadTrack]);

  // 6. Turn (Move shoulders, hips rotate slightly)
  const turnTimes = [0, 1.0];
  const turnSpineRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.2, 0)).toArray(),
  ];
  const turnTrack = new THREE.QuaternionKeyframeTrack("spine.quaternion", turnTimes, turnSpineRot);
  clips.turn = new THREE.AnimationClip("turn", 1.0, [turnTrack]);

  // 7. Walk (Legs swinging back and forth, arms swing in opposite phase)
  const walkTimes = [0, 0.4, 0.8, 1.2];
  const leftLegRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
  ];
  const rightLegRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 0)).toArray(),
  ];
  const walkLeftLegTrack = new THREE.QuaternionKeyframeTrack(
    "left_leg.quaternion",
    walkTimes,
    leftLegRot
  );
  const walkRightLegTrack = new THREE.QuaternionKeyframeTrack(
    "right_leg.quaternion",
    walkTimes,
    rightLegRot
  );
  clips.walk = new THREE.AnimationClip("walk", 1.2, [walkLeftLegTrack, walkRightLegTrack]);

  // 8. LookBack (Spine twists slightly back, head rotates significantly back)
  const lookBackTimes = [0, 1.2];
  const lookBackHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 1.5, 0)).toArray(),
  ];
  const lookBackHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    lookBackTimes,
    lookBackHeadRot
  );
  clips.lookback = new THREE.AnimationClip("lookback", 1.2, [lookBackHeadTrack]);

  // 9. Wait (Quiet idle stance looking back)
  const waitHeadRot = [
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 1.5, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.02, -Math.PI / 1.5, 0)).toArray(),
    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 1.5, 0)).toArray(),
  ];
  const waitHeadTrack = new THREE.QuaternionKeyframeTrack(
    "head.quaternion",
    idleTimes,
    waitHeadRot
  );
  clips.wait = new THREE.AnimationClip("wait", 4, [waitHeadTrack]);

  // Placeholders
  clips.point = new THREE.AnimationClip("point", 1, []);
  clips.wave = new THREE.AnimationClip("wave", 1, []);
  clips.sit = new THREE.AnimationClip("sit", 1, []);
  clips.think = new THREE.AnimationClip("think", 1, []);
  clips.celebrate = new THREE.AnimationClip("celebrate", 1, []);

  return {
    group,
    mixer,
    clips,
    notebookLight,
  };
}
