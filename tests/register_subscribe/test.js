const Srf = require('drachtio-srf');
const srf = new Srf();

srf.connect({
  host: '127.0.0.1',
  port: 9022,
  secret: 'cymru'
});

srf.on('connect', (err, hostport) => {
  console.log(`connected to a drachtio server listening on: ${hostport}`);
});


srf.register((req, res) => {
  console.log('register')
  res.send(200, 'OK')
});


srf.subscribe((req, res) => {
  console.log('subscribe')
  res.send(200, 'OK')
});


var tl = require('tracing-log')
var sip = require ('sip-lab')
var Zester = require('zester')
var z = new Zester()
var m = require('data-matching')
var sip_msg = require('sip-matching')

const drachtio_server = "127.0.0.1:6060"
const domain = 'test1.com'

async function test() {
    await z.sleep(1000)

    //sip.set_log_level(6)
    sip.dtmf_aggregation_on(500)

    z.trap_events(sip.event_source, 'event', (evt) => {
        var e = evt.args[0]
        return e
    })

    tl.info(sip.start((data) => { tl.info(data)} ))

    t1 = sip.transport.create("127.0.0.1", 5090, 1)
    t2 = sip.transport.create("127.0.0.1", 5092, 1)

    tl.info("t1", t1)
    tl.info("t2", t2)

    var a1 = sip.account.create(t1.id, domain, drachtio_server, 'user1', 'pass1')

    sip.account.register(a1, true)

    await z.wait([
        {
            event: 'registration_status',
            account_id: a1.id,
            code: 200,
            reason: 'OK',
            expires: 60
        },
    ], 1000)

    const s1 = sip.subscription_create(t1.id, 'dialog', 'application/dialog-info+xml', '<sip:user1@test1.com>', '<sip:user1@test1.com>', 'sip:park1@test1.com', `sip:${drachtio_server}`, 'test1.com', 'user1', 'user1')

    sip.subscription_subscribe(s1, 120, '', '', '')

    await z.wait([
        {
            event: 'response',
            subscription_id: s1,
            method: 'SUBSCRIBE',
            msg: sip_msg({
                $rs: '200',
                $rr: 'OK',
            })
        },
    ], 1000)

    sip.account.unregister(a1)

    await z.wait([
        {
            event: 'registration_status',
            account_id: a1.id,
            code: 200,
            reason: 'OK',
            expires: 0,
        },
    ], 1000)

    console.log("Success")

    sip.stop()
}


test()
.catch(e => {
    console.error(e)
    process.exit(1)
})
