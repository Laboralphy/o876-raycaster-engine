const Scheduler = require('../lib/src/engine/Scheduler').default;

describe('#Scheduler', function() {
    it('should initialy have no commands', function() {
        const s = new Scheduler();
        expect(s.aCommands.length).toBe(0);
        expect(s.bInvalid).toBeTruthy();
        expect(s.nTime).toBe(0);
    });

    it('should update command list', function() {
        const s = new Scheduler();
        let x = 0;
        s.delayCommand(function() { x = 1; }, 50);
        expect(s.aCommands.length).toBe(1);
        expect(s.bInvalid).toBeTruthy();
    });

    it('should execute delayed command', function() {
        const s = new Scheduler();
        s.schedule(1000);
        expect(s.nTime).toBe(1000);
        let x = 0;
        s.delayCommand(function() { x = 1; }, 50);
        expect(x).toBe(0);
        s.schedule(1010);
        expect(s.nTime).toBe(1010);
        expect(x).toBe(0);
        s.schedule(1030);
        expect(s.nTime).toBe(1030);
        expect(x).toBe(0);
        s.schedule(1060);
        expect(s.nTime).toBe(1060);
        expect(x).toBe(1);
    });

    it('should execute two delayed commands', function() {
        const s = new Scheduler();
        s.schedule(1000);
        expect(s.nTime).toBe(1000);
        let x = 0;
        let y = 0;
        s.delayCommand(function() { x = 1; }, 50);
        expect(x).toBe(0);
        expect(y).toBe(0);
        s.schedule(1010);
        s.delayCommand(function() { y = 1; }, 25);
        expect(s.bInvalid).toBe(true);
        expect(s.aCommands.length).toBe(2);
        expect(s.aCommands[0].delay).toBe(1050);
        expect(s.aCommands[1].delay).toBe(1035);
        expect(s.nTime).toBe(1010);
        expect(x).toBe(0);
        expect(y).toBe(0);
        s.schedule(1031);
        expect(s.bInvalid).toBe(false);
        expect(s.nTime).toBe(1031);
        expect(x).toBe(0);
        expect(y).toBe(0);
        s.schedule(1034);
        expect(x).toBe(0);
        expect(y).toBe(0);
        s.schedule(1035);
        expect(x).toBe(0);
        expect(y).toBe(1);
        s.schedule(1060);
        expect(s.nTime).toBe(1060);
        expect(x).toBe(1);
    });

});