import { RescueResource } from "../metadata/types";
import SpaceStation from "../repository/classes/SpaceStation"
import { describe, expect, it } from '@jest/globals';
import SpaceStationOrion from "../repository/classes/SpaceStationOrion"
import SpaceStationAndromeda from "../repository/classes/SpaceStationAndromeda";
import SpaceStationBorealis from "../repository/classes/SpaceStationBorealis";
import Game from "../repository/classes/Game";
import CountdownClock from "../repository/countdown-clock";

describe('spacestation in Rescue Orion', () => {
    it('general spacestation get location correctly, picks up and drops off resources correctly', () => {
        const spacestation = new SpaceStation('t6', 10, 10, [RescueResource.O2ReplacementCells]);
        expect(spacestation.getLocation()).toEqual('t6');
        spacestation.dropOffTo(RescueResource.AITechnology);
        expect(spacestation.getRescueResources()).toEqual([ 'O2 Replacement Cells' , 'AI Technology' ]);
        spacestation.pickUpFrom(RescueResource.AITechnology);
        expect(spacestation.getRescueResources()).toEqual([ 'O2 Replacement Cells' ]);
    });

    it('spacestationAndromeda',() => {
        const spacestation = new SpaceStationAndromeda('andromeda', 10, 10, []);
        expect(spacestation.getRescueResources()).toEqual([]);
        spacestation.onDayUpdate(13);
        expect(spacestation.getRescueResources()).toEqual(['Food Repair Team']);
    });

    it('spacestationBorealis',() => {
        const countdownlock=new CountdownClock(100);
        var accumulatedTime=0;
        const game = new Game(countdownlock,0,(time) => {
            accumulatedTime += time;
        });
        const spacestation = new SpaceStationBorealis('t5', 50, 30, [
            RescueResource.OxygenRepairTeam,
            RescueResource.FoodRepairTeam,
        ], game);
        expect(spacestation.canPickUp(RescueResource.OxygenRepairTeam)).toBeFalsy();
        expect(spacestation.canPickUp(RescueResource.FoodRepairTeam)).toBeTruthy();
        spacestation.dropOffTo(RescueResource.AITechnology);
        expect(game.newMessage).toBeTruthy();
        expect(spacestation.canPickUp(RescueResource.OxygenRepairTeam)).toBeTruthy();
        expect(spacestation.canPickUp(RescueResource.FoodRepairTeam)).toBeTruthy();
    });

    it('spacestationOrion',() => {
        const countdownlock=new CountdownClock(100);
        var accumulatedTime=0;
        const game = new Game(countdownlock,0,(time) => {
            accumulatedTime += time;
        });
        const spacestation = new SpaceStationOrion('t2', 10, 10, [], game, 20);
        expect(spacestation.getScientistCount()).toEqual(20);
        expect(spacestation.canPickUp(RescueResource.AITechnology)).toEqual(true);
        spacestation.onDayUpdate(6);
        expect(spacestation.getScientistCount()).toEqual(19);
        spacestation.onDayUpdate(7);
        expect(spacestation.getScientistCount()).toEqual(18);
        spacestation.dropOffTo(RescueResource.O2ReplacementCells);
        spacestation.onDayUpdate(8);
        expect(spacestation.getScientistCount()).toEqual(18);
        
        spacestation.onDayUpdate(21);
        expect(spacestation.getScientistCount()).toEqual(17);
        spacestation.onDayUpdate(22);
        expect(spacestation.getScientistCount()).toEqual(16);
        spacestation.dropOffTo(RescueResource.OxygenRepairTeam);
        spacestation.dropOffTo(RescueResource.WaterRepairTeam)
        spacestation.onDayUpdate(23);
        expect(spacestation.getScientistCount()).toEqual(16);
        spacestation.onDayUpdate(24);
        expect(spacestation.getScientistCount()).toEqual(15);
        spacestation.dropOffTo(RescueResource.FoodRepairTeam);
        spacestation.onDayUpdate(25);
        expect(spacestation.getScientistCount()).toEqual(12);
        spacestation.dropOffTo(RescueResource.MedicalRepairTeam);
        spacestation.onDayUpdate(26);
        expect(spacestation.getScientistCount()).toEqual(12);

    });
});
  