const redis = require("redis");
const { redisPath } = require("../../config.json");

// redis-14402.c10.us-east-1-4.ec2.cloud.redislabs.com:14402
// ZYMN1LgW4PTYTnToZB5WMgvCHvMLX4w6

module.exports = async () => {
    // console.log(redisPath)
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: redisPath,
        })

        client.on("error", (err) => {
            console.error("Redis error:", err);
            client.quit();
            reject(err);
        });

        client.on("ready", () => {
            resolve(client);
        });
    });
};

module.exports.expire = (callback) => {
    const expired = () => {
        const sub = redis.createClient({ url: redisPath });
        sub.subscribe("__keyevent@0__:expired", () => {
            sub.on("message", (channel, message) => {
                callback(message);
            });
        });
    };

    // const pub = redis.createClient({ url: redisPath });
    // pub.send_command(
    //     "config",
    //     ["set", "notify-keyspace-events", "Ex"],
    //     expired()
    // );
};
