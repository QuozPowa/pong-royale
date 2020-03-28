import querystring from 'query-string';
import { Lib } from 'lance-gg';
import AsteroidsClientEngine from '../client/AsteroidsClientEngine';
import AsteroidsGameEngine from '../common/AsteroidsGameEngine';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 0,
    scheduler: 'fixed',
    syncOptions: {
        sync: 'extrapolate',
        localObjBending: 0,
        remoteObjBending: 0.6,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const gameEngine = new AsteroidsGameEngine(options);
const clientEngine = new AsteroidsClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
