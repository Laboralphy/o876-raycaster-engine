const Scheduler = require('../lib/src/engine/Scheduler').default;

describe('#Scheduler', function() {
    it('should initialy have no commands', function() {
        const s = new Scheduler();
        expect(s.aCommands.delayed.length).toBe(0);
        expect(s.bInvalid).toBeTruthy();
        expect(s.nTime).toBe(0);
    });

    it('should update command list', function() {
        const s = new Scheduler();
        let x = 0;
        s.delayCommand(function() { x = 1; }, 50);
        expect(s.aCommands.delayed.length).toBe(1);
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
        expect(s.aCommands.delayed.length).toBe(2);
        expect(s.aCommands.delayed[0].delay).toBe(1050);
        expect(s.aCommands.delayed[1].delay).toBe(1035);
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


    it('should execute looped command once', function() {
        const s = new Scheduler();
        let y = 0;
        s.loopCommand(function () {
            ++y;
        }, 100);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(100);
        s.schedule(50);
        expect(y).toBe(0);
        s.schedule(100);
        expect(y).toBe(1);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(200);
    });

    it('should execute looped command twice', function() {
        const s = new Scheduler();
        let y = 0;
        s.loopCommand(function () {
            ++y;
        }, 100);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(100);
        s.schedule(50);
        expect(y).toBe(0);
        s.schedule(100);
        expect(y).toBe(1);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(200);
        s.schedule(199);
        expect(y).toBe(1);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(200);
        s.schedule(200);
        expect(y).toBe(2);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(300);
    });

    it('should execute looped command once after cancel', function() {
        const s = new Scheduler();
        let y = 0;
        const id = s.loopCommand(function () {
            ++y;
        }, 100);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(100);
        s.schedule(50);
        expect(y).toBe(0);
        s.schedule(100);
        expect(y).toBe(1);
        expect(s.aCommands.looped[0].duration).toBe(100);
        expect(s.aCommands.looped[0].time).toBe(200);
        s.cancelCommand(id);
        expect(s.aCommands.looped.length).toBe(0);
        s.schedule(199);
        expect(y).toBe(1);
        s.schedule(200);
        expect(y).toBe(1);
    });
});