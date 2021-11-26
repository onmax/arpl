import {flags} from '@oclif/command'
import {RpcCommand} from '../../lib/rpc-command'

export default class ValidatorNew extends RpcCommand {
  static description = 'Register a new validator (requires 10k NIM deposit)'

  static args = [{
    name: 'wallet',
    description: 'Address of unlocked account to send transaction from',
    required: true,
  }, {
    name: 'secret_key',
    description: 'Secret key of the new validator',
    required: true,
  }]

  static flags = {
    ...RpcCommand.flags,
    'validator-address': flags.string({
      description: 'Address of unlocked account to own the validator (default: sending address)',
    }),
    'warm-address': flags.string({
      description: 'Address of the warm key that signs retire, reactivate & unparking transactions (default: sending address)',
    }),
    'reward-address': flags.string({
      description: 'Reward address for the validator (default: sending address)',
    }),
    'signal-data': flags.string({
      description: '32-byte signal data (default: none)',
      default: '',
    }),
    ...RpcCommand.txFlags,
  }

  async run() {
    const {args, flags} = this.parse(ValidatorNew)

    const hash = await this.call(ValidatorNew, `${flags.dry ? 'create' : 'send'}NewValidatorTransaction`, [
      args.wallet,
      flags['validator-address'] || args.wallet,
      flags['warm-address'] || args.wallet,
      args.secret_key,
      flags['reward-address'] || args.wallet,
      flags['signal-data'],
      flags.fee,
      flags['validity-start'],
    ])

    this.log(`Transaction ${flags.dry ? 'prepared' : 'sent'}: ${hash}`)
  }
}
