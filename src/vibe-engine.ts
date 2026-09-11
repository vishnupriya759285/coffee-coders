// Centralized Vibe Engine
// Computes 5D/6D Vibe Vector, Multi-Person Group/Duo dynamics, and Item Changes

import type {
  AccessoryCue,
  ColorCue,
  DuoAnalysis,
  GraphicCue,
  GroupAnalysis,
  ObjectCue,
  PatternCue,
  PeopleMode,
  PersonAnalysis,
  SceneAnalysis,
  TextCue,
  VibeVector,
  VibeVectorDimensions,
} from './types';

export class VibeEngine {
  private lastSceneAnalysis: SceneAnalysis | null = null;
  private lastItemSignature: string = '';

  /**
   * Calculate Vibe Vector from single person visual attributes
   */
  public computePersonVibeVector(
    style: string,
    colors: ColorCue[],
    pattern?: PatternCue,
    graphic?: GraphicCue,
    text?: TextCue,
    accessories: AccessoryCue[] = [],
    objects: ObjectCue[] = [],
    expression?: string
  ): VibeVector {
    // Base scores (0-100)
    let energy = 45;
    let edge = 35;
    let playful = 30;
    let dreamy = 25;
    let classy = 25;
    let street = 40;

    const styleLower = style.toLowerCase();

    // 1. Style Contributions
    if (styleLower.includes('streetwear')) {
      street += 35;
      energy += 20;
      edge += 25;
    } else if (styleLower.includes('formal') || styleLower.includes('suit') || styleLower.includes('blazer')) {
      classy += 45;
      street -= 10;
      edge += 10;
    } else if (styleLower.includes('sporty') || styleLower.includes('athletic')) {
      energy += 35;
      street += 15;
      playful += 15;
    } else if (styleLower.includes('minimal')) {
      classy += 20;
      dreamy += 15;
      energy -= 10;
    } else if (styleLower.includes('vintage') || styleLower.includes('retro')) {
      dreamy += 25;
      classy += 15;
      playful += 15;
    } else if (styleLower.includes('y2k') || styleLower.includes('cyber')) {
      energy += 25;
      edge += 20;
      playful += 25;
    } else if (styleLower.includes('elegant')) {
      classy += 40;
      dreamy += 15;
    } else if (styleLower.includes('alternative') || styleLower.includes('grunge')) {
      edge += 35;
      street += 20;
      energy += 15;
    } else if (styleLower.includes('dreamy') || styleLower.includes('pastel')) {
      dreamy += 40;
      playful += 20;
      edge -= 15;
    } else if (styleLower.includes('edgy') || styleLower.includes('punk')) {
      edge += 45;
      energy += 25;
      classy -= 10;
    } else if (styleLower.includes('playful')) {
      playful += 40;
      energy += 25;
    } else if (styleLower.includes('futuristic') || styleLower.includes('techwear')) {
      edge += 30;
      energy += 30;
      street += 25;
    }

    // 2. Color Influences
    for (const c of colors) {
      if (c.isDark) {
        edge += 18;
        street += 15;
      }
      if (c.isBright && c.isWarm) {
        energy += 20;
        playful += 15;
      }
      if (c.name.toLowerCase().includes('red')) {
        energy += 22;
        edge += 12;
      }
      if (c.name.toLowerCase().includes('pastel') || c.name.toLowerCase().includes('pink')) {
        dreamy += 22;
        playful += 12;
      }
      if (c.name.toLowerCase().includes('white')) {
        classy += 15;
        dreamy += 10;
      }
      if (c.name.toLowerCase().includes('blue')) {
        dreamy += 14;
        energy -= 5;
      }
      if (c.name.toLowerCase().includes('purple')) {
        dreamy += 15;
        edge += 15;
      }
    }

    // 3. Pattern Recognition Bonuses
    if (pattern) {
      energy += pattern.energyBonus;
      const dim = pattern.vibeBonus.dim;
      if (dim === 'energy') energy += pattern.vibeBonus.value;
      if (dim === 'edge') edge += pattern.vibeBonus.value;
      if (dim === 'playful') playful += pattern.vibeBonus.value;
      if (dim === 'dreamy') dreamy += pattern.vibeBonus.value;
      if (dim === 'classy') classy += pattern.vibeBonus.value;
      if (dim === 'street') street += pattern.vibeBonus.value;
    }

    // 4. Graphic Semantic Influences
    if (graphic) {
      const gName = graphic.name.toLowerCase();
      if (gName.includes('racing')) {
        energy += 24;
        street += 15;
      } else if (gName.includes('flame')) {
        energy += 28;
        edge += 25;
      } else if (gName.includes('guitar')) {
        edge += 22;
        energy += 18;
      } else if (gName.includes('flower')) {
        dreamy += 25;
        playful += 12;
      } else if (gName.includes('gaming')) {
        energy += 20;
        playful += 20;
      } else if (gName.includes('heart')) {
        dreamy += 22;
        playful += 18;
      } else if (gName.includes('basketball')) {
        energy += 26;
        street += 22;
      } else if (gName.includes('space')) {
        dreamy += 20;
        edge += 15;
      }
    }

    // 5. OCR Text Semantic Influences
    if (text) {
      const tSig = text.semanticSignal.toUpperCase();
      if (tSig.includes('NIGHT')) {
        energy += 25;
        edge += 20;
        street += 20;
      }
      if (tSig.includes('POSITIVE') || tSig.includes('UPBEAT')) {
        playful += 30;
        energy += 20;
      }
      if (tSig.includes('ROCK') || tSig.includes('REBELLIOUS')) {
        edge += 35;
        energy += 25;
      }
      if (tSig.includes('WORKOUT') || tSig.includes('VELOCITY')) {
        energy += 35;
        street += 15;
      }
      if (tSig.includes('CHILL') || tSig.includes('MORNING')) {
        dreamy += 25;
        classy += 10;
        energy -= 10;
      }
      if (tSig.includes('TRAVEL') || tSig.includes('SUNSHINE')) {
        playful += 25;
        dreamy += 20;
      }
      if (tSig.includes('BOSS')) {
        classy += 25;
        edge += 25;
        energy += 20;
      }
    }

    // 6. Accessories Influences
    for (const acc of accessories) {
      const aName = acc.name.toLowerCase();
      if (aName.includes('sunglasses')) {
        edge += 16;
        street += 14;
      } else if (aName.includes('chain')) {
        street += 22;
        edge += 12;
      } else if (aName.includes('cap') || aName.includes('beanie')) {
        street += 15;
        energy += 8;
      } else if (aName.includes('headphone')) {
        street += 12;
        dreamy += 12;
      } else if (aName.includes('tie') || aName.includes('collar')) {
        classy += 28;
      } else if (aName.includes('watch')) {
        classy += 14;
      }
    }

    // 7. Held Objects
    for (const obj of objects) {
      const oName = obj.name.toLowerCase();
      if (oName.includes('coffee') || oName.includes('drink')) {
        dreamy += 18;
        classy += 12;
        energy -= 6;
      } else if (oName.includes('book')) {
        dreamy += 22;
        classy += 20;
        energy -= 12;
      } else if (oName.includes('basketball')) {
        energy += 30;
        street += 22;
      } else if (oName.includes('guitar')) {
        edge += 25;
        energy += 20;
      } else if (oName.includes('laptop')) {
        classy += 16;
        dreamy += 12;
      } else if (oName.includes('food')) {
        playful += 25;
        energy += 12;
      } else if (oName.includes('phone')) {
        street += 10;
      }
    }

    // 8. Expression Modifiers
    if (expression) {
      const expLower = expression.toLowerCase();
      if (expLower.includes('smile') || expLower.includes('happy')) {
        playful += 20;
        energy += 10;
      } else if (expLower.includes('excited') || expLower.includes('hype')) {
        energy += 25;
        playful += 15;
      } else if (expLower.includes('swagger') || expLower.includes('confident')) {
        street += 20;
        edge += 15;
      } else if (expLower.includes('serious') || expLower.includes('boss')) {
        edge += 18;
        classy += 10;
      } else if (expLower.includes('calm') || expLower.includes('chill')) {
        dreamy += 15;
        energy -= 8;
      }
    }

    // Clamp all dimensions between 10 and 99
    const clamped: VibeVectorDimensions = {
      energy: Math.min(99, Math.max(10, Math.round(energy))),
      edge: Math.min(99, Math.max(10, Math.round(edge))),
      playful: Math.min(99, Math.max(10, Math.round(playful))),
      dreamy: Math.min(99, Math.max(10, Math.round(dreamy))),
      classy: Math.min(99, Math.max(10, Math.round(classy))),
      street: Math.min(99, Math.max(10, Math.round(street))),
    };

    // Determine dominant and secondary vibes
    const dimEntries: [string, number][] = Object.entries(clamped);
    dimEntries.sort((a, b) => b[1] - a[1]);

    const dominantVibe = dimEntries[0][0].toUpperCase();
    const secondaryVibes = [dimEntries[1][0].toUpperCase(), dimEntries[2][0].toUpperCase()];

    return {
      ...clamped,
      dominantVibe,
      secondaryVibes,
    };
  }

  /**
   * Duo / Two-Person Vibe Analysis
   */
  public computeDuoVibe(personA: PersonAnalysis, personB: PersonAnalysis): DuoAnalysis {
    const vibeA = personA.vibeDimensions;
    const vibeB = personB.vibeDimensions;

    // Detect vibe conflict (distance in edge vs dreamy or classy vs street)
    const edgeDiff = Math.abs(vibeA.edge - vibeB.edge);
    const energyDiff = Math.abs(vibeA.energy - vibeB.energy);
    const styleDiff = Math.abs(vibeA.classy - vibeB.street);

    const hasConflict = edgeDiff > 35 || styleDiff > 40 || energyDiff > 45;
    const conflictDetails = hasConflict
      ? `Visual styles clash: ${personA.aesthetic} meets ${personB.aesthetic}`
      : undefined;

    const combinedVibe = `${personA.aesthetic} × ${personB.aesthetic}`;
    const selectedSoundtrackVibe = hasConflict
      ? `VIBE CONFLICT · ${personA.aesthetic} vs ${personB.aesthetic}`
      : `DUO HARMONY · ${combinedVibe}`;

    return {
      personA,
      personB,
      combinedVibe,
      hasConflict,
      conflictDetails,
      selectedSoundtrackVibe,
    };
  }

  /**
   * Friend Group Mode Analysis (3+ people)
   */
  public computeGroupAnalysis(people: PersonAnalysis[]): GroupAnalysis {
    const count = Math.max(3, people.length);

    // Group energy = average energy with chaos multiplier
    const avgEnergy = people.reduce((acc, p) => acc + p.vibeDimensions.energy, 0) / people.length;
    const groupEnergy = Math.min(98, Math.max(65, Math.round(avgEnergy * 1.08 + (count - 2) * 3)));

    // Style diversity score based on variance of dominant vibes
    const aesthetics = new Set(people.map((p) => p.aesthetic));
    const styleDiversity = Math.min(96, Math.round((aesthetics.size / count) * 85 + 15));

    // Aux winner: Person with highest combined energy + swagger score
    let maxAuxScore = -1;
    let auxWinnerIdx = 0;
    people.forEach((p, i) => {
      const auxScore = p.vibeDimensions.energy * 0.6 + p.vibeDimensions.street * 0.4 + Math.random() * 5;
      if (auxScore > maxAuxScore) {
        maxAuxScore = auxScore;
        auxWinnerIdx = i;
      }
    });

    const winner = people[auxWinnerIdx] || people[0];

    // Group tags
    const possibleTags = ['CHAOTIC', 'HYPE', 'PLAYFUL', 'URBAN', 'PARTY', 'UNHINGED', 'MAIN CHARACTERS'];
    const selectedTags = [
      groupEnergy > 85 ? 'CHAOTIC' : 'HYPE',
      styleDiversity > 60 ? 'TOO MANY MAIN CHARACTERS' : 'UNIFIED DRIP',
      'PARTY',
      'URBAN',
    ];

    return {
      peopleCount: count,
      groupEnergy,
      styleDiversity,
      dominantColor: people[0]?.clothingColors[0]?.name || 'Urban Dark',
      dominantAesthetic: 'Multi-Person Eclectic Flow',
      groupVibeTitle: groupEnergy > 88 ? `CHAOTIC ENERGY ${groupEnergy}%` : `HYPE SQUAD ${groupEnergy}%`,
      groupTags: selectedTags,
      auxWinner: {
        personIndex: auxWinnerIdx + 1,
        personLabel: `PERSON ${auxWinnerIdx + 1}`,
        energyScore: Math.round(winner.vibeDimensions.energy),
        reason: `${winner.aesthetic} drip and highest kinetic presence`,
      },
    };
  }

  /**
   * Detect "One Item Changed" delta between scans
   */
  public detectItemChange(
    newItemName: string,
    currentVibe: VibeVector,
    previousVibe: VibeVector | null
  ): {
    detected: boolean;
    itemName: string;
    classinessDelta: number;
    energyDelta: number;
    summary: string;
  } | null {
    if (!previousVibe) return null;

    const classinessDelta = currentVibe.classy - previousVibe.classy;
    const energyDelta = currentVibe.energy - previousVibe.energy;

    if (Math.abs(classinessDelta) < 6 && Math.abs(energyDelta) < 6) {
      return null;
    }

    return {
      detected: true,
      itemName: newItemName,
      classinessDelta,
      energyDelta,
      summary: `NEW ITEM DETECTED: ${newItemName.toUpperCase()} · CLASSINESS ${classinessDelta > 0 ? '+' : ''}${classinessDelta}% · ENERGY ${energyDelta > 0 ? '+' : ''}${energyDelta}%`,
    };
  }
}

export const vibeEngine = new VibeEngine();
