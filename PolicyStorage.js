const STORE = "policy_store";

const POLICYSTRUCT = {
    "id": "",
    "holder_name": "",
    "policy_number": "",
    "client_type": "",
    "policy_date": "",
    "policy_class": "",
    "policy_sub_class": "",
    "payment_mode": "",
    "premium_paid": ""
    
}

const localPolicyDict = {
    policies: []
}
  


class PolicyStorage {

    constructor () {}

    static policyDbIdChecker () {      
    
        let policyStore = JSON.parse(localStorage.getItem(STORE)) || null;
        if(policyStore !== null) {
            if(policyStore.policies.length === 0) {
                return 1;
            } else {
                let lastIndex = policyStore.policies.length - 1
                let storedTxnArr = policyStore.policies[lastIndex];
                let sN = storedTxnArr.id;
                let newSn = parseInt(sN) + 1;
                return newSn
            }
        } else {
            localStorage.setItem(STORE, JSON.stringify(localPolicyDict));
            return 1;
        }
    }
    

    static async save(data) {     
        
        
      
        let dataStructArr = Object.keys(data);
        
        let policyStructArr = Object.keys(POLICYSTRUCT);

        let isPolicyKeyLengthSame = policyStructArr.length === dataStructArr.length ? true : false;


        let unMatchedPolicyKeys = [];


        for (let i = 0; i < policyStructArr.length; i++ ) {
            if (policyStructArr[i] !== dataStructArr[i]) unMatchedPolicyKeys = [...unMatchedPolicyKeys, dataStructArr[i]];
        }

        let isPolicyKeysMatched = unMatchedPolicyKeys.length > 0 ? false : true;

        

        if (data !== null) {
            if(isPolicyKeyLengthSame && isPolicyKeysMatched) {
                let policyId = this.policyDbIdChecker();
                
    
                let retrievedStore = JSON.parse(localStorage.getItem(STORE)) || null;
    
                let dataToSave = {...data, "id": policyId}
    
              
                
            if (retrievedStore === null) {
                localStorage.setItem(STORE, JSON.stringify({...localPolicyDict, policies: [...localPolicyDict.policies, dataToSave]}));
                return {"status": "success", "data": "Policy Saved successfully!"};
            } else {
                let existPolicyNumberArr = retrievedStore.policies.filter(item => item.policy_number === data.policy_number);
                if(existPolicyNumberArr.length == 0) {
                    localStorage.setItem(STORE, JSON.stringify({...retrievedStore, policies: [...retrievedStore.policies, dataToSave]}))
                    return {"status": "success", "data": "Policy Saved successfully!"};
                } else {
                    return {
                        "status": "error",
                        "data": "Policy Number already exists"
                    }
                }
            }                
                            
            } else if (!isPolicyKeyLengthSame) {
                return {
                    "status": "error",
                    "data": "Your data keys length are not same"
                }
            } else if (!isPolicyKeysMatched) {
                return {
                    "status": "error",
                    "data": `These keys ${unMatchedPolicyKeys.toString()} do not match`
                }            
            }
        } else {
            return {
                "status": "error",
                "data": "Data to save cannot be null!"
            }
        }


        
    }

    static resetStore () {
        localStorage.setItem(STORE, JSON.stringify(localPolicyDict));
    }


    static updateById (id, data) {
        let retrievedStore = JSON.parse(localStorage.getItem(STORE)) || null;
        if(retrievedStore !== null) {

            let modStore = retrievedStore.map(policyObj => {
                if(policyObj.id == id) {
                    policyObj = {...data, "id": id};
                    return policyObj;
                } else {
                    return;
                }
            });

            localStorage.setItem(STORE, modStore);


        } else {
            localStorage.setItem(STORE, localPolicyDict);
            return {
                "status": "error",
                "data": "Store does not exist but a new store has been created"
            }
        }
    }


   
}