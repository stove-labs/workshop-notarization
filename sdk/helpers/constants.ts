export module constants {
    export const rpcErrors = {
        michelson: {
            scriptRejected: 'proto.006-PsCARTHA.michelson_v1.script_rejected',
            runtimeError: 'proto.006-PsCARTHA.michelson_v1.runtime_error'
        }
    }
    export const contractErrors = {
        documentHashAlreadyNotarized: '1',
        documentNotFound: '2',
        documentAlreadySigned: '3',
        senderIsNotASigneeForThisDocument: '4'
    }
}


