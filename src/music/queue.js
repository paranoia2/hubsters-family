import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';
import play from 'play-dl';

class MusicQueue {
  constructor(){ this.queues = new Map(); }
  _ensure(gid){ if(!this.queues.has(gid)) this.queues.set(gid,{connection:null,player:null,songs:[],volume:0.6}); return this.queues.get(gid); }
  async enqueue({ guild, channel, query, requestedBy }){
    const state = this._ensure(guild.id);
    let info;
    try{
      if (play.yt_validate(query) !== 'search' || /(spotify|soundcloud|deezer)\.com/.test(query)) {
        info = await play.video_info(query).catch(async ()=> (await play.search(query,{limit:1}))[0]);
      } else { info = (await play.search(query,{limit:1}))[0]; }
    }catch{}
    if(!info) throw new Error('Не знайдено трек.');
    const title = info.title || info.video_details?.title || 'Unknown';
    const url = info.url || info.video_details?.url || query;
    state.songs.push({ title, url, requestedBy });

    if(!state.player){
      state.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
      state.player.on(AudioPlayerStatus.Idle, ()=> this._playNext(guild.id));
    }
    if(!state.connection){
      state.connection = joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator, selfDeaf: true });
      state.connection.subscribe(state.player);
    }
    if(state.player.state.status !== AudioPlayerStatus.Playing){ this._playNext(guild.id); return { started:true, title, url }; }
    else return { queued:true, title, url };
  }
  async _playNext(gid){
    const st = this._ensure(gid);
    const next = st.songs.shift();
    if(!next){ const conn = getVoiceConnection(gid); if(conn) conn.destroy(); st.connection=null; st.player=null; st.current=null; return; }
    let stream;
    if (/(spotify|deezer)\.com/.test(next.url)) {
      const s = await play.search(next.title,{limit:1}); stream = await play.stream(s[0].url,{ quality: 2 });
    } else {
      const isOk = play.yt_validate(next.url) !== 'search' || next.url.includes('soundcloud.com');
      if(isOk) stream = await play.stream(next.url,{ quality: 2 });
      else { const s = await play.search(next.title,{limit:1}); stream = await play.stream(s[0].url,{ quality: 2 }); }
    }
    const res = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    if(res.volume) res.volume.setVolume(st.volume);
    st.player.play(res); st.current = next;
  }
  skip(g){ const st=this._ensure(g); st?.player?.stop(true); }
  stop(g){ const st=this._ensure(g); st.songs=[]; st?.player?.stop(true); }
  pause(g){ return this._ensure(g).player?.pause(); }
  resume(g){ return this._ensure(g).player?.unpause(); }
  setVolume(g,v){ const st=this._ensure(g); st.volume=v; const res=st.player?._state?.resource; if(res?.volume) res.volume.setVolume(v); }
  getQueue(g){ const st=this._ensure(g); return { current: st.current, list: st.songs.slice(), volume: st.volume }; }
}
export const music = new MusicQueue();
