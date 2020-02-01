import log from './client/log.macro'

function main() {
  log({type: 'hello'});
  log({type: 'there'});
  log({type: 'you'});
}

main()