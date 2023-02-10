const {versionname} = require("./config.json")

module.exports = {
    OWNER_IDS: ["801006452416184330"], // Bot owner ID's
    SUPPORT_SERVER: "https://discord.gg/JAPEAajAmu", // Your bot support server
    PREFIX_COMMANDS: {
        ENABLED: true, // Enable/Disable prefix commands
        DEFAULT_PREFIX: "!", // Default prefix for the bot
    },
    INTERACTIONS: {
        SLASH: true, // Should the interactions be enabled
        CONTEXT: false, // Should contexts be enabled
        GLOBAL: true, // Should the interactions be registered globally
        TEST_GUILD_ID: "1011919694464294932", // Guild ID where the interactions should be registered. [** Test you commands here first **]
    },
    EMBED_COLORS: {
        BOT_EMBED: "#2f3136",
        TRANSPARENT: "#2f3136",
        SUCCESS: "#2f3136",
        ERROR: "#D61A3C",
        WARNING: "#F7E919",
    },
    CACHE_SIZE: {
        GUILDS: 100,
        USERS: 10000,
        MEMBERS: 10000,
    },
    MESSAGES: {
        API_ERROR: "Arka planda kod çalıştırılırken bir sorun saptandı. Yeniden kullanmayı deneyin ya da sunucumuza katılın",
    },

    // PLUGINS

    AUTOMOD: {
        ENABLED: true,
        LOG_EMBED: "#2f3136",
        DM_EMBED: "#2f3136",
    },

    DASHBOARD: {
        enabled: false, // enable or disable dashboard
        baseURL: "http://localhost:8080", // base url
        failureURL: "http://localhost:8080", // failure redirect url
        port: "8080", // port to run the bot on
    },

    ECONOMY: {
        ENABLED: true,
        CURRENCY: " **☾**",
        DAILY_COINS: 100, // coins to be received by daily command
        MIN_BEG_AMOUNT: 100, // minimum coins to be received when beg command is used
        MAX_BEG_AMOUNT: 2500, // maximum coins to be received when beg command is used
    },

    MUSIC: {
        ENABLED: false,
        IDLE_TIME: 60, // Time in seconds before the bot disconnects from an idle voice channel
        MAX_SEARCH_RESULTS: 5,
        DEFAULT_SOURCE: "SC", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud
        // Add any number of lavalink nodes here
        // Refer to https://github.com/freyacodes/Lavalink to host your own lavalink server
        LAVALINK_NODES: [
            {
                host: "localhost",
                port: 2333,
                password: "youshallnotpass",
                id: "801006452416184330",
                secure: false,
            },
        ],
    },

    GIVEAWAYS: {
        ENABLED: true,
        REACTION: "🎁",
        START_EMBED: "#2f3136",
        END_EMBED: "#2f3136",
    },

    IMAGE: {
        ENABLED: true,
        BASE_API: "https://strangeapi.fun/api",
    },

    INVITE: {
        ENABLED: true,
    },

    MODERATION: {
        ENABLED: true,
        EMBED_COLORS: {
            TIMEOUT: "#2f3136",
            UNTIMEOUT: "#2f3136",
            KICK: "#2f3136",
            SOFTBAN: "#2f3136",
            BAN: "#2f3136",
            UNBAN: "#2f3136",
            VMUTE: "#2f3136",
            VUNMUTE: "#2f3136",
            DEAFEN: "#2f3136",
            UNDEAFEN: "#2f3136",
            DISCONNECT: "#2f3136",
            MOVE: "#2f3136",
        },
    },

    PRESENCE: {
        ENABLED: true, // Whether or not the bot should update its status
        STATUS: "online", // The bot's status [online, idle, dnd, invisible]
        TYPE: "PLAYING", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
        MESSAGE: `Thunar Beta ・ ${versionname}`, // Your bot status message
    },

    STATS: {
        ENABLED: true,
        XP_COOLDOWN: 5, // Cooldown in seconds between messages
        DEFAULT_LVL_UP_MSG: "{member:tag}, You just advanced to **Level {level}**",
    },

    SUGGESTIONS: {
        ENABLED: true, // Should the suggestion system be enabled
        EMOJI: {
            UP_VOTE: "⬆️",
            DOWN_VOTE: "⬇️",
        },
        DEFAULT_EMBED: "#2f3136",
        APPROVED_EMBED: "#2f3136",
        DENIED_EMBED: "#2f3136",
    },

    TICKET: {
        ENABLED: true,
        CREATE_EMBED: "#2f3136",
        CLOSE_EMBED: "#2f3136",
    },
};
