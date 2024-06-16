// Example of combining callback and Observer pattern: Events/EventEmitter API style for async task
import { EventEmitter } from 'events';
import { nextTick } from 'process'; 
function ticker(number, callback) {
  const eventEmitter = new EventEmitter();
  let timeElapsed = 0;
  let ticksEmitted = 0;

  function tick() {
    let currentTime = Date.now();
    console.log(`currentTime = ${currentTime}`);
    if (currentTime % 5 === 0) {
      nextTick(() => {
        const err = new Error('the timestamp at the moment of a tick is divisible by 5');
        eventEmitter.emit('error', err);
        callback(err, null);
      });
      return;
    }

    if (timeElapsed < number) {
      // emitting event asynchronously to avoid Zalgo
      nextTick(() => { 
        eventEmitter.emit('tick', ++ticksEmitted, timeElapsed);
        timeElapsed += 50;
      });
      setTimeout(tick, 50);
    } else {
      nextTick(() => callback(null, ticksEmitted)); // Node.js error first callback signature pattern
    }

  }
  tick();
  return eventEmitter;
}

ticker(300, (err, count) => {
    if (err) {
      console.error(`Callback with error ${err.message}`);
    } else {
      console.log(`ticks been emitted ${count}`);
    }
  })
  .on('tick', (index, timeElapsed) => console.log(`ticked ${index} at ${timeElapsed}`))
  .on('error', (err) => console.error(`Emitted and listened to: ${err}`));