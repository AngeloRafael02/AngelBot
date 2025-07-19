// Mostly Used for organize and handle .env values
// to be tested
export class DiscordBot {
    // Credentials
    public static BOT_URL:string=process.env.BOT_URL ?? '';
    public static BOT_TOKEN:string=process.env.BOT_TOKEN ?? '';
    public static CLIENT_ID:string=process.env.CLIENT_ID ?? '';
    // API_Keys
    public static WEATHER_API_KEY:string=process.env.WEATHER_API_KEY ?? '';
    public static NEWS_API_KEY:string=process.env.NEWS_API_KEY ?? '';
    // Configs
    private BOT_STATUS:string='online';
    get get_bot_status(){ return this.BOT_STATUS }
    set set_bot_status(status:string){this.BOT_STATUS = status}
    private ACTIVITY_TYPE:string='playing';
    get get_activity_type(){ return this.ACTIVITY_TYPE }
    set set_activity_type(type:string){this.ACTIVITY_TYPE=type}
    private ACTIVITY_NAME:string='discord';
    get get_activity_name(){ return this.ACTIVITY_NAME }
    set set_activity_name(name:string){this.ACTIVITY_NAME=name}
}

export class DiscordServer {
    public static guildId:string=process.env.GUILD_ID ?? ''
    //Channel Names
    public static WEATHER_CHANNEL_NAME:string=process.env.WEATHER_CHANNEL_NAME ?? '';
    public static WEATHER_CHANNEL_ID:string=process.env.WEATHER_CHANNEL_ID ?? '';
    public static NEWS_CHANNEL_NAME:string=process.env.NEWS_CHANNEL_NAME ?? '';
    public static NEWS_CHANNEL_ID:string=process.env.NEWS_CHANNEL_ID ?? '';
}