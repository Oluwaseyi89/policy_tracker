// import { PolicyStorage } from "./PolicyStorage";

let firebaseApp;
let storeV;
let auth;
let collection;
let addDoc;
let doc;
let signInWithEmailAndPassword;
let createUserWithEmailAndPassword;




const currentContent = document.getElementById('current-content');
let tabItems = document.getElementsByClassName('tab-item');

let searchLens = document.getElementsByClassName('fa-search')[0];

let searchBtn = document.getElementById('search-btn');

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


let thisMonth = `
    <h3>These are all the policies due for renewal this month</h3>
`;

let nextMonth = `
    <h3>These are all the policies due for renewal next month</h3>
`;

let twoMonthsTime = `
    <h3>These are all the policies due for renewal in 2 months time</h3>
`;

let threeMonthsTime = `
    <h3>These are all the policies due for renewal in 3 months time</h3>
`;


function updateTabs () {
    Array.from(tabItems).forEach(tabItem => {
        if (tabItem.getAttribute("data-state") == "true") {
            tabItem.style.backgroundColor = 'orangered';
            tabItem.style.border = 'solid 1px orangered';
            tabItem.style.color = 'white';
        } else {
            // alert(tabItem.getAttribute("data-state"));
            tabItem.style.backgroundColor = 'white';
            tabItem.style.border = 'solid 2px orange';
            tabItem.style.borderLeft = 'solid 1px orange';
            tabItem.style.color = 'orange';
        }
    });
}







Array.from(tabItems).forEach(tabItem => {
    let tabContent = tabItem.innerHTML;

    tabItem.addEventListener('click', () => {

        tabItem.setAttribute("data-state", "true");
        updateTabs();

        switch(tabContent) {
            case 'Register Policy': currentContent.innerHTML = policyForm;
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            break;
            case 'All Policies': renderAllPolicies();
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            break;
            case 'This Month': renderThisMonthPolicies();
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            break;
            case 'Next Month': renderNextMonthPolicies();
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            break;
            case '2-Months-Time': renderTwoMonthsTimePolicies();
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            break;
            case '3-Months-Time': renderThreeMonthsTimePolicies();
            tabItem.setAttribute("data-state", "true");
            updateTabs();
            
            break;
            default: currentContent.innerHTML = policyForm;
            tabItem.setAttribute("data-state", "false");
            updateTabs();
            
        }
    });
});




currentContent.innerHTML = policyForm;

// let submitPolicyBtn = document.getElementById('policy-save-btn');


// submitPolicyBtn.addEventListener('click', (e) => {
//     e.preventDefault();

//     let holderName = document.getElementById('holder-name');
// let policyNumber = document.getElementById('policy-number');
// let clientType = document.getElementById('client-type');
// let policyDate = document.getElementById('policy-date');
// let policyClass = document.getElementById('policy-class');
// let policySubClass = document.getElementById('policy-sub-class');
// let paymentMode = document.getElementById('payment-mode');
// let premiumPaid = document.getElementById('premium-paid');

// let policyToSave = {
//     "id": "",
//     "holder_name": holderName.value,
//     "policy_number": policyNumber.value,
//     "client_type": clientType.value,
//     "policy_date": policyDate.value,
//     "policy_class": policyClass.value,
//     "policy_sub_class": policySubClass.value,
//     "payment_mode": paymentMode.value,
//     "premium_paid": premiumPaid.value
// }

//     if(holderName.value && policyNumber.value && clientType.value && policyDate.value && policyClass.value && policySubClass.value && paymentMode.value && premiumPaid.value) {

//         console.log(policyToSave);
//         PolicyStorage.save(policyToSave).then(res => {
//             if(res.status === "success") {
//                 showAlertView(true, "Success!", res.data);
//                 } else if(res.status === "error") {
//                     showAlertView(true, "Error!", res.data);
//             }           
//         }).catch(err => showAlertView(true, "Error!", err.message));
//     } else {
//         showAlertView(true, "Incomplete Data!", "Fill all available fields!");
//     }
// });


// submitPolicyBtn.addEventListener('mouseenter', () => {
//     submitPolicyBtn.style.backgroundColor = 'orangered';
//     submitPolicyBtn.style.transition = '0.7s';
    
// });

// submitPolicyBtn.addEventListener('mouseleave', () => {
//     submitPolicyBtn.style.backgroundColor = 'orange';
//     submitPolicyBtn.style.transition = '0.7s';

// });



function renderAllPolicies () {
    let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;
    // let retrievedPolicies = JSON.parse(localStorage.getItem('firebase_policies')) || null;
    

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
    let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;

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
    let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;

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
    let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;

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
    let retrievedPolicies = JSON.parse(localStorage.getItem('policy_store')) || null;

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
