// Example of combining callback and Observer pattern: Events/EventEmitter API style for async task
import { EventEmitter } from 'events';
function ticker(number, callback) {
  const eventEmitter = new EventEmitter();
  let timeElapsed = 0;
  let ticksEmitted = 0;

  function tick() {
    timeElapsed += 50;
    if (timeElapsed < number) {
      // could be wrapped into process.nextTick() if we didn't control all the call sites - to make sure events
      // always emitted asynchronously:
      eventEmitter.emit('tick', ++ticksEmitted); 
      setTimeout(tick, 50);
    } else {
      callback(null, ticksEmitted); // Node.js error first callback signature pattern
    }
  }
  setTimeout(tick, 50);
  return eventEmitter;
}

ticker(301, (err, count) => console.log(`ticks been emitted ${count}`))
  .on('tick', (index) => console.log(`ticked ${index}`)) 