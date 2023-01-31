module.exports = class User {
    constructor(id) {
        if (typeof (id) !== 'string') return console.trace(`id must be string in User class creation, given ${typeof (id)}`);
        this.id = id;
    }
    async fetchCooldowns(command) {
        const response = await global.redisClient.get(['cooldowns', this.id, command].join(':'));
        let data;
        if (response) {
            try {
                data = JSON.parse(response);
            } catch {
                return false;
            }
        }
        return data || false;
    }
    async setCooldown(command, seconds) {
        const body = { Timestamp: Date.now(), Duration: (seconds * 1000) };
        const response = await global.redisClient.set(['cooldowns', this.id, command].join(':'), JSON.stringify(body), "EX", seconds);
        if (response == 'OK') return true;
        return false;
    }
}