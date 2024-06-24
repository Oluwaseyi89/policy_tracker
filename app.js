const STORAGE_SETTING = "storage-setting";
const CURRENT_TAB = "current-tab";

const tabInfo = JSON.parse(localStorage.getItem(CURRENT_TAB)) || null;

let storedSetting = JSON.parse(localStorage.getItem(STORAGE_SETTING)) || null;

let useLocalStorage = (storedSetting != null) && storedSetting.useLocalStorage;

const currentContent = document.getElementById('current-content');

let tabItems = document.getElementsByClassName('tab-item');

let localStorageBtn = document.getElementById('local-storage-btn');
let firebaseBtn = document.getElementById('firebase-btn');

let searchInput = document.getElementById('search-input');
let searchBtn = document.getElementById('search-btn');

let localStoragePolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
let firebasePolicies = JSON.parse(localStorage.getItem('firebase_policies')) || null;


searchBtn.addEventListener('click', doSearch, false);

const tabsDict = {
    "register": false,
    "all-policies": false,
    "this-month": true,
    "next-month": false,
    "two-months": false,
    "three-months": false,
}



searchInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') doSearch();
}, false);

function doSearch () {
    if(useLocalStorage) {
        let searchedName = localStoragePolicies.policies.filter(item => item.holder_name.toLowerCase() == searchInput.value.toLowerCase());
        let searchedPolicyNum = localStoragePolicies.policies.filter(item => item.policy_number == searchInput.value);

        if(searchedName.length > 0) {
            fillWithSearchResult(searchedName);
        } else if (searchedPolicyNum.length > 0) {
            fillWithSearchResult(searchedPolicyNum);
        } else {
            currentContent.innerHTML = "";
            currentContent.innerHTML = `
                <h3 class='no-result'>No results matched your searched parameter</h3>
            `
        }
        
    } else if (!useLocalStorage) {
        let searchedName = firebasePolicies.policies.filter(item => item.holder_name.toLowerCase() == searchInput.value.toLowerCase());
        let searchedPolicyNum = firebasePolicies.policies.filter(item => item.policy_number == searchInput.value);

        if(searchedName.length > 0) {
            fillWithSearchResult(searchedName);
        } else if (searchedPolicyNum.length > 0) {
            fillWithSearchResult(searchedPolicyNum);
        } else {
            currentContent.innerHTML = "";
            currentContent.innerHTML = `
                <h3 class='no-result'>No results matched your searched parameter</h3>
            `
        }

    }
    
}



let gearIcon = document.getElementById("gear-svg");
let settingsPane = document.getElementById("settings-pane");
let headerElem = document.getElementsByTagName("header")[0];

headerElem.addEventListener('mouseleave', () => {
    settingsPane.style.display = 'none';
});

let storeSettingDict = {
    "useLocalStorage": true
}

window.addEventListener('load', () => {
  
    if(storedSetting === null) {
        localStorage.setItem(STORAGE_SETTING, JSON.stringify(storeSettingDict));
    } else if (useLocalStorage) {
        localStorageBtn.checked = true;
        firebaseBtn.checked = false;
    } else if (!useLocalStorage) {
        firebaseBtn.checked = true;
        localStorageBtn.checked = false;
    }

    // if(tabInfo == null) {
    //     localStorage.setItem(CURRENT_TAB, JSON.stringify(tabsDict));
    // } else {
    //     let values = Object.values(tabInfo);
            
    //     values.forEach((item, index) => {
    //         if (item == true) {
    //             console.log(index);
    //             getCurrentTab(index);
    //         }
    //     });
    // }


});




localStorageBtn.addEventListener('click', () => {
   if(!useLocalStorage) {
    localStorageBtn.checked = true;
    firebaseBtn.checked = false;
    localStorage.setItem(STORAGE_SETTING, JSON.stringify({...storeSettingDict, "useLocalStorage": true}));
    window.location.reload();
} else if (useLocalStorage) {
       localStorageBtn.checked = false;
       firebaseBtn.checked = false;
       localStorage.setItem(STORAGE_SETTING, JSON.stringify({...storeSettingDict, "useLocalStorage": false}));
       window.location.reload();
   }
});

firebaseBtn.addEventListener('click', () => {
   if(useLocalStorage) {
    localStorageBtn.checked = false;
    firebaseBtn.checked = true;
    localStorage.setItem(STORAGE_SETTING, JSON.stringify({...storeSettingDict, "useLocalStorage": false}));
    window.location.reload();
} else if (!useLocalStorage) {
       localStorageBtn.checked = false;
       firebaseBtn.checked = false;
       localStorage.setItem(STORAGE_SETTING, JSON.stringify({...storeSettingDict, "useLocalStorage": true}));
       window.location.reload();
   }
});



gearIcon.addEventListener('mouseenter', () => {
    gearIcon.style.fill = 'white';
    settingsPane.style.display = 'block';
});

gearIcon.addEventListener('mouseleave', () => {
    gearIcon.style.fill = 'orangered';
});


settingsPane.addEventListener('mouseenter', () => {
    settingsPane.style.display = 'block';
});

settingsPane.addEventListener('mouseleave', () => {
    settingsPane.style.display = 'none';
});

let searchLens = document.getElementsByClassName('fa-search')[0];


searchBtn.addEventListener('mouseenter', () => {
    searchLens.style.color = 'white';
});

searchBtn.addEventListener('mouseleave', () => {
    searchLens.style.color = 'orange';
});


let policyForm = `
    <form class='registration-form'>
        <legend>Save a Policy</legend> 
        <div id='all-input-container'>
            <div class='input-container'>
                <input type='text' name='holder_name' id='holder-name' placeholder='Policy Holder Name' />
            </div>
            <div class='input-container'>
                <input type='text' name='policy_number' id='policy-number' placeholder='Policy Number' />
            </div>
            <div class='input-container'>
                <input type='text' name='client_type' id='client-type' placeholder='Client Type' />
            </div>
            <div class='input-container'>
                <span>Policy Date</span>
                <input type='date' name='policy_date' id='policy-date' placeholder='Policy Date' />
            </div>
            <div class='input-container'>
                <input type='text' name='policy_class' id='policy-class' placeholder='Policy Class' />
            </div>
            <div class='input-container'>
                <input type='text' name='policy_sub_class' id='policy-sub-class' placeholder='Policy Sub-Class' />
            </div>
            <div class='input-container'>
                <input type='text' name='payment_mode' id='payment-mode' placeholder='Payment Mode' />
            </div>
            <div class='input-container'>
                <input type='text' name='premium_paid' id='premium-paid' placeholder='Premium Paid (NGN)' />
            </div>
        </div>
        <input id='policy-save-btn' type='submit' value='Save'/>
    </form>
`;


Array.from(tabItems).forEach((tabItem, index) => {
   
    tabItem.addEventListener('click', () => {

        switch(index) {
            case 0 : renderRegister();
            // setTabByIndex(0);
            getCurrentTab(0);
            break;
            case 1: renderAllPolicies();
            // setTabByIndex(1);
             getCurrentTab(1);
            break;
            case 2: renderThisMonthPolicies();
            // setTabByIndex(2);
             getCurrentTab(2);
            break;
            case 3: renderNextMonthPolicies();
            // setTabByIndex(3);
             getCurrentTab(3);
            break;
            case 4: renderTwoMonthsTimePolicies();
            // setTabByIndex(4);
             getCurrentTab(4);
            break;
            case 5: renderThreeMonthsTimePolicies();
            // setTabByIndex(5);
             getCurrentTab(5);            
            break;
            default: setCurrentContentNull();        
            
        }
    });
});




currentContent.innerHTML = policyForm;

function renderRegister() {
    currentContent.innerHTML = "";
    currentContent.innerHTML = policyForm;
} 

function setCurrentContentNull () {
    currentContent.innerHTML = "";
}



function renderAllPolicies () {
    // let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    let retrievedPolicies = !useLocalStorage ? (JSON.parse(localStorage.getItem('firebase_policies')) || null) : (JSON.parse(localStorage.getItem('policy_store')) || null);
    

    let renderContainer = document.createElement("div");

    if(retrievedPolicies !== null) {
        currentContent.innerHTML = "";
        renderContainer.style.paddingTop = '30px';
        renderContainer.style.paddingLeft = '30px';
        renderContainer.style.paddingRight = '30px';
        renderContainer.style.display = 'flex';
        renderContainer.style.flexDirection = 'row';
        renderContainer.style.flexWrap = 'wrap';
        renderContainer.style.justifyContent = 'space-between';
        renderContainer.style.alignItems = 'flex-start';
        renderContainer.style.zIndex = '-1';
        let sortedPolicies = retrievedPolicies.policies.sort((a, b) => {
            let nameA = a.holder_name.toLowerCase();
            let nameB = b.holder_name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
        sortedPolicies.forEach(item => {
            renderContainer.innerHTML += `<div class='policy-item'>
            <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
            <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
            <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
            <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
            <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
            <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
            </div>`;
        });

        currentContent.appendChild(renderContainer);
    } else return "";

}

function renderThisMonthPolicies () {
    // let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    let retrievedPolicies = !useLocalStorage ? (JSON.parse(localStorage.getItem('firebase_policies')) || null) : (JSON.parse(localStorage.getItem('policy_store')) || null);


    let dateObj = new Date().toISOString();

    let justDate = dateObj.split("T")[0];
    let thisMonthD = justDate.split("-")[1];

    

    let renderContainer = document.createElement("div");

    if(retrievedPolicies !== null) {
        currentContent.innerHTML = "";
        renderContainer.style.paddingTop = '30px';
        renderContainer.style.paddingLeft = '30px';
        renderContainer.style.paddingRight = '30px';
        renderContainer.style.display = 'flex';
        renderContainer.style.flexDirection = 'row';
        renderContainer.style.flexWrap = 'wrap';
        renderContainer.style.justifyContent = 'space-between';
        renderContainer.style.alignItems = 'flex-start';
        renderContainer.style.zIndex = '-1';
        let thisMonthPolicies = retrievedPolicies.policies.filter(item => item.policy_date.split("-")[1] == thisMonthD);
        let sortedPolicies = thisMonthPolicies.sort((a, b) => {
            let nameA = a.holder_name.toLowerCase();
            let nameB = b.holder_name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
        sortedPolicies.forEach(item => {
            renderContainer.innerHTML += `<div class='policy-item'>
            <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
            <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
            <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
            <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
            <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
            <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
            </div>`;
        });

        currentContent.appendChild(renderContainer);
    } else return "";

}


function renderNextMonthPolicies () {
    // let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    let retrievedPolicies = !useLocalStorage ? (JSON.parse(localStorage.getItem('firebase_policies')) || null) : (JSON.parse(localStorage.getItem('policy_store')) || null);


    let dateObj = new Date().toISOString();

    let justDate = dateObj.split("T")[0];
    let thisMonthD = justDate.split("-")[1];
    let thisMonthInt = parseInt(thisMonthD);
    let nextMonthInt = thisMonthInt <= 11 ? (thisMonthInt + 1) : 1;
    let nextMonthD = nextMonthInt < 10 ? ("0" + nextMonthInt) : nextMonthInt.toString();

    

    let renderContainer = document.createElement("div");

    if(retrievedPolicies !== null) {
        currentContent.innerHTML = "";
        renderContainer.style.paddingTop = '30px';
        renderContainer.style.paddingLeft = '30px';
        renderContainer.style.paddingRight = '30px';
        renderContainer.style.display = 'flex';
        renderContainer.style.flexDirection = 'row';
        renderContainer.style.flexWrap = 'wrap';
        renderContainer.style.justifyContent = 'space-between';
        renderContainer.style.alignItems = 'flex-start';
        renderContainer.style.zIndex = '-1';
        let nextMonthPolicies = retrievedPolicies.policies.filter(item => item.policy_date.split("-")[1] == nextMonthD);
        let sortedPolicies = nextMonthPolicies.sort((a, b) => {
            let nameA = a.holder_name.toLowerCase();
            let nameB = b.holder_name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
        sortedPolicies.forEach(item => {
            renderContainer.innerHTML += `<div class='policy-item'>
            <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
            <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
            <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
            <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
            <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
            <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
            </div>`;
        });

        currentContent.appendChild(renderContainer);
    } else return "";

}


function renderTwoMonthsTimePolicies () {
    // let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    let retrievedPolicies = !useLocalStorage ? (JSON.parse(localStorage.getItem('firebase_policies')) || null) : (JSON.parse(localStorage.getItem('policy_store')) || null);


    let dateObj = new Date().toISOString();

    let justDate = dateObj.split("T")[0];
    let thisMonthD = justDate.split("-")[1];
    let thisMonthInt = parseInt(thisMonthD);
    let twoMonthInt = thisMonthInt <= 10 ? (thisMonthInt + 2) : (thisMonthInt == 11 ? 1 : 2);
    let twoMonthD = twoMonthInt < 10 ? ("0" + twoMonthInt) : twoMonthInt.toString();

    

    let renderContainer = document.createElement("div");

    if(retrievedPolicies !== null) {
        currentContent.innerHTML = "";
        renderContainer.style.paddingTop = '30px';
        renderContainer.style.paddingLeft = '30px';
        renderContainer.style.paddingRight = '30px';
        renderContainer.style.display = 'flex';
        renderContainer.style.flexDirection = 'row';
        renderContainer.style.flexWrap = 'wrap';
        renderContainer.style.justifyContent = 'space-between';
        renderContainer.style.alignItems = 'flex-start';
        renderContainer.style.zIndex = '-1';
        let twoMonthPolicies = retrievedPolicies.policies.filter(item => item.policy_date.split("-")[1] == twoMonthD);
        let sortedPolicies = twoMonthPolicies.sort((a, b) => {
            let nameA = a.holder_name.toLowerCase();
            let nameB = b.holder_name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
        sortedPolicies.forEach(item => {
            renderContainer.innerHTML += `<div class='policy-item'>
            <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
            <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
            <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
            <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
            <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
            <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
            </div>`;
        });

        currentContent.appendChild(renderContainer);
    } else return "";

}


function renderThreeMonthsTimePolicies () {
    // let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    let retrievedPolicies = !useLocalStorage ? (JSON.parse(localStorage.getItem('firebase_policies')) || null) : (JSON.parse(localStorage.getItem('policy_store')) || null);


    let dateObj = new Date().toISOString();

    let justDate = dateObj.split("T")[0];
    let thisMonthD = justDate.split("-")[1];
    let thisMonthInt = parseInt(thisMonthD);
    let threeMonthInt = thisMonthInt <= 9 ? (thisMonthInt + 3) : (thisMonthInt == 10 ? 1 : (thisMonthInt == 11 ? 2 : 3));
    let threeMonthD = threeMonthInt < 10 ? ("0" + threeMonthInt) : threeMonthInt.toString();

    

    let renderContainer = document.createElement("div");

    if(retrievedPolicies !== null) {
        currentContent.innerHTML = "";
        renderContainer.style.paddingTop = '30px';
        renderContainer.style.paddingLeft = '30px';
        renderContainer.style.paddingRight = '30px';
        renderContainer.style.display = 'flex';
        renderContainer.style.flexDirection = 'row';
        renderContainer.style.flexWrap = 'wrap';
        renderContainer.style.justifyContent = 'space-between';
        renderContainer.style.alignItems = 'flex-start';
        renderContainer.style.zIndex = '-1';
        let threeMonthPolicies = retrievedPolicies.policies.filter(item => item.policy_date.split("-")[1] == threeMonthD);
        let sortedPolicies = threeMonthPolicies.sort((a, b) => {
            let nameA = a.holder_name.toLowerCase();
            let nameB = b.holder_name.toLowerCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
        sortedPolicies.forEach(item => {
            renderContainer.innerHTML += `<div class='policy-item'>
            <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
            <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
            <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
            <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
            <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
            <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
            </div>`;
        });

        currentContent.appendChild(renderContainer);
    } else return "";

}



function fillWithSearchResult (searchArray) { 
 
     let renderContainer = document.createElement("div");
 
     if(searchArray.length > 0) {
         currentContent.innerHTML = "";
         renderContainer.style.paddingTop = '30px';
         renderContainer.style.paddingLeft = '30px';
         renderContainer.style.paddingRight = '30px';
         renderContainer.style.display = 'flex';
         renderContainer.style.flexDirection = 'row';
         renderContainer.style.flexWrap = 'wrap';
         renderContainer.style.justifyContent = 'space-between';
         renderContainer.style.alignItems = 'flex-start';
         renderContainer.style.zIndex = '-1';
         let sortedPolicies = searchArray.sort((a, b) => {
             let nameA = a.holder_name.toLowerCase();
             let nameB = b.holder_name.toLowerCase();
             if(nameA < nameB) return -1;
             if(nameA > nameB) return 1;
             return 0;
         });
         sortedPolicies.forEach(item => {
             renderContainer.innerHTML += `<div class='policy-item'>
             <p><strong>Policy Holder</strong>: ${item.holder_name}</p>                
             <p><strong>Policy Number</strong>: ${item.policy_number}</p>                
             <p><strong>Policy Class</strong>: ${item.policy_class}</p>                
             <p><strong>Policy Sub-Class</strong>: ${item.policy_sub_class}</p>                
             <p><strong>Policy Date</strong>: ${item.policy_date}</p>                
             <p><strong>Premium Paid</strong>: NGN ${item.premium_paid}</p>                
             </div>`;
         });
 
         currentContent.appendChild(renderContainer);
     } else {
        currentContent.innerHTML = "";
        currentContent.innerHTML = `
            <h3 class='no-result'>No results matched your searched parameter</h3>
        `
     }
 
}

function getCurrentTab(index) {

    Array.from(tabItems).forEach((item, idx) => {
        if(idx == index) {
            item.style.backgroundColor = 'orangered';
            item.style.color = 'white';
            item.style.border = 'solid white 2px';

            switch (idx) {
                case 0: renderRegister();
                break;
                case 1: renderAllPolicies();
                break;
                case 2: renderThisMonthPolicies();
                break;
                case 3: renderNextMonthPolicies();
                break;
                case 4: renderTwoMonthsTimePolicies();
                break;
                case 5: renderThreeMonthsTimePolicies();
                break;
                default: setCurrentContentNull();
            }
        } else {
            item.style.backgroundColor = 'white';
            item.style.color = 'orange';
            item.style.border = 'solid orange 2px';
        }
    });
}

// function refresh () {
//     // window.location.href = '/';
//     window.location.reload();
// }

// function setTabByIndex (index) {
//     let keys = Object.keys(tabsDict);
//     let values = Object.values(tabsDict);

//     let modValues = values.map((item, idx) => {
//         if(idx == index) {
//             item = true;
//             return item;
//         } else {
//             item = false;
//             return item;
//         }
//     });

//    let newTabDict = {};

//    keys.forEach((key, index) => {
//     newTabDict[key] = modValues[index];
//    });

//    localStorage.setItem(CURRENT_TAB, JSON.stringify(newTabDict));
// //    refresh();
// }

function showAlertView(shouldShow, title, message) {
    let alertElement = document.createElement("div");
    let titleElement = document.createElement("h4");
    let messageElement = document.createElement("p");

    titleElement.innerHTML = title;
    messageElement.innerHTML = message;

    titleElement.style.textAlign = 'center';
    titleElement.style.marginTop = '15px';
    titleElement.style.fontFamily = 'Sans-Serif';
    titleElement.style.color = 'orangered';

    messageElement.style.textAlign = 'justify';
    messageElement.style.paddingLeft = '15px';
    messageElement.style.marginTop= '20px';
    messageElement.style.fontFamily= 'Helvetica';


    alertElement.style.height = "250px";
    alertElement.style.width = "450px";
    alertElement.style.borderRadius = "15px";
    
    alertElement.style.backgroundColor = "#F8F6F0";
    alertElement.style.border = "solid silver 1px";
    alertElement.style.boxShadow = "2px 2px 4px 2px silver";
    
    if(shouldShow) {
        currentContent.appendChild(alertElement);
        alertElement.style.position = "fixed";
        alertElement.style.marginTop = "-600px";
        alertElement.style.marginLeft = `calc((100vw - 450px)/2)`;
        alertElement.appendChild(titleElement);
        alertElement.appendChild(messageElement);

            setTimeout(() => {
                currentContent.removeChild(alertElement);
            }, 5000);
        }
}