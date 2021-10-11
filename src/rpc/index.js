const { cryptoWaitReady } = require('@polkadot/util-crypto')
const { ApiRx, WsProvider, ApiPromise, Keyring } = require('@polkadot/api')

let api;
export default class RpcInitialization {
    
    constructor(rpcUrl) {
        this.rpcUrl = rpcUrl;
        this.changeRpcUrl = changeRpcUrl;
    }
   
     static init = async (rpcUrl, changeRpcUrl) => {
        if(api && !changeRpcUrl) {
            // console.log('In if returing api')
            return api;
        }
        console.log('Init function running',rpcUrl);
        // if(!rpcUrl) return api
        const wsProvider = new WsProvider(rpcUrl)
        api = await ApiPromise.create({provider: wsProvider})
        await api.isReady
        await cryptoWaitReady();
        console.log('Api configuration complete')
        // tokenName = await api.registry.chainTokens
        // chainDecimals = await api.registry.chainDecimals
        // console.log('Chain decimals', chainDecimals)
        // console.log('token Name', tokenName)
        return api
    }
}