const User = require('../User');
const Channel = require('../Channel');
const System = require('../System');


describe('User', function() {
	describe('setters/getters', function() {
		it('should set name properly', function() {
			let u = new User({id: 1, name: "johnson"});
			expect(u.name()).toBe('johnson');
            u.name('joe');
            expect(u.name()).toBe('joe');
		});
		it('should set id properly', function() {
			let u = new User({id: 12, name: "x"});
            expect(u.id()).toBe(12);
			u.id(13);
            expect(u.id()).toBe(13);
		});
		it('should display properly', function() {
			let u = new User({id: 12, name: 'johnson'});
			expect(u.display()).toBe('#12 (johnson)');
		});
	});

	describe('message transmission', function() {
		it('should transmit a message', function() {
			let u = new User({});
			let uSender = new User({});
			u.name('johnson');
			u.id(12);
			uSender.name('joe gillian');
			uSender.id(13);
			let aLogEvent = [];
			u.on('message-received', event => aLogEvent.push(event.from.name() + ':' + event.message));
			u.transmitMessage(uSender, 'let\'s play rugball !', null);
			expect(aLogEvent[0]).toBe('joe gillian:let\'s play rugball !');
		});
	});
});


describe('Channel', function() {
	describe('setters/getters', function() {
		it('should set name properly', function() {
			let c = new Channel();
			c.name('lobby');
			expect(c.name()).toBe('lobby');
		});
		it('should set id properly', function() {
			let c = new Channel();
			c.id(12);
			expect(c.id()).toBe(12);
		});
		it('should display properly', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			expect(c.display()).toBe('#12 (lobby)');
		});
	});

	describe('user present', function() {
		it('should test if user is present', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let users = [new User({}), new User({}), new User({})];
			users.forEach((u, i) => u.id(i + 1).name('name' + i));
			c.addUser(users[0]);
			c.addUser(users[2]);
			expect(c.userPresent(users[0])).toBeTruthy();
			expect(c.userPresent(users[1])).toBeFalsy();
			expect(c.userPresent(users[2])).toBeTruthy();
			expect(c.userPresent(users[2])).toBeTruthy();
			c.dropUser(users[2]);
			expect(c.userPresent(users[0])).toBeTruthy();
			expect(c.userPresent(users[1])).toBeFalsy();
			expect(c.userPresent(users[2])).toBeFalsy();
			c.dropUser(users[0]);
			expect(c.userPresent(users[0])).toBeFalsy();
			expect(c.userPresent(users[1])).toBeFalsy();
			expect(c.userPresent(users[2])).toBeFalsy();
		});
	});

	describe('purge', function() {
		it('should purge the channel from all users', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let users = [new User({}), new User({}), new User({}), new User({}), new User({}), new User({}), new User({}), new User({}), new User({}), new User({})];
			users.forEach((u, i) => c.addUser(u.id(i + 1).name('name' + i)));
			expect(users.every(u => c.userPresent(u))).toBeTruthy();
			c.purge();
			expect(users.some(u => c.userPresent(u))).toBeFalsy();
			expect(c.users().length).toBe(0);
		});
	});

	describe('events join/leave', function() {
		it('should trigger leave/join events', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let aLog = [];
			let users = [new User({}), new User({}), new User({})];
			function evJoin(event) {
				aLog.push('join ' + event.user.display());
			}
			function evLeave(event) {
				aLog.push('leave ' + event.user.display());
			}
			c.on('user-added', evJoin);
			c.on('user-dropped', evLeave);
			users.forEach((u, i) => c.addUser(u.id(i + 1).name('name' + i)));
			c.dropUser(users[1]);
			expect(aLog).toEqual([
				'join #1 (name0)',
				'join #2 (name1)',
				'join #3 (name2)',
				'leave #2 (name1)'
			]);
		});
	});

	describe('events message', function() {
		it('should send messages', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let aLog = [];
			let users = [new User({}), new User({}), new User({})];
			function evMsg(event) {
				aLog.push('message from:' + event.from.display() + ' to:' + event.to.display() + ' channel:' + event.channel.display() + ' ' + event.message);
			}
			users.forEach((u, i) => c.addUser(u.id(i + 1).name('name' + i).on('message-received', evMsg)));
			users[0].sendMessage(c, 'hello world !');
			expect(aLog).toEqual([
				'message from:#1 (name0) to:#1 (name0) channel:#12 (lobby) hello world !',
				'message from:#1 (name0) to:#2 (name1) channel:#12 (lobby) hello world !',
				'message from:#1 (name0) to:#3 (name2) channel:#12 (lobby) hello world !',
			]);
		});
	});

	describe('channel drop', function() {
		it('should send messages', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let aLog = [];
			let users = [new User({}), new User({}), new User({})];
			function evMsg(event) {
				aLog.push('message from:' + event.from.display() + ' to:' + event.to.display() + ' channel:' + event.channel.display() + ' ' + event.message);
			}
			users.forEach((u, i) => c.addUser(u.id(i + 1).name('name' + i).on('message-received', evMsg)));
			users[0].sendMessage(c, 'hello world !');
			expect(aLog).toEqual([
				'message from:#1 (name0) to:#1 (name0) channel:#12 (lobby) hello world !',
				'message from:#1 (name0) to:#2 (name1) channel:#12 (lobby) hello world !',
				'message from:#1 (name0) to:#3 (name2) channel:#12 (lobby) hello world !',
			]);
		});
	});

	describe('find channel', function() {
		it ('should find channel', function() {
			let c = new Channel();
			c.name('lobby').id(12);
			let s = new System();
			s.addChannel(c);
			expect(s._channels.length).toBe(1);
			expect(s._channels[0]).toBe(c);
			expect(s._channels.find(x => x.id() === 12)).toBe(c);
			expect(s.getChannel(12)).toBeDefined();
			expect(s.getChannel(13)).toBeUndefined();
		})
	});
});