let orgBoard;
let owner
let divs = [];
let depts = [];
let hats = [];
let deputy = [];

let GetOrgBoard = (dbData) => {

    return new Promise((resolve, reject) => {
        let error = false

        let arr = []
        orgBoard = {}
        owner = {}
        divs = []
        depts = []
        hats = []
        arr = Object.values(dbData)

        owner = Object.values(dbData).find(o => o.type === 'owner') ?
            Object.values(dbData).find(o => o.type === 'owner')
            :
            null
        orgBoard = Object.values(dbData).find(o => o.type === 'ed')

        arr.forEach((item, i) => {
            if (item.type && item.type === 'exect') {
                return orgBoard.children.push(item)
            } else if (item.type && item.type === 'divs') {
                return divs.push(item)
            } else if (item.type && item.type === 'depts') {
                return depts.push(item)
            } else if (item.type && item.type === 'hat' && item.childOf) {
                return hats.push(item)
            } 
        })
        depts.forEach((dept) => {
            let index = divs.indexOf(divs.find(o => o.id === dept.childOf))
            divs[index].depts.push(dept)
        })
        divs.forEach((div) => {
            let index = orgBoard.children.indexOf(orgBoard.children.find(o => o.id === div.childOf))
            orgBoard.children[index] ? orgBoard.children[index].children.push(div) : owner ? owner.children.push(div) : console.log('no owner');
            if (div.division === 'Division Seven') {
                div.depts.sort((a, b) => { return a.position - b.position })
            }
        })

        hats.forEach((hat) => {
            // A hat can be a child of a department or a division. Below sorts for both situations 
            let indexDiv = divs.indexOf(divs.find(o => o.id === hat.childOf))
            if (divs[indexDiv]) { return divs[indexDiv].hats.push(hat) }

            let index = depts.indexOf(depts.find(o => o.id === hat.childOf))
            if (depts[index]) { return depts[index].hats.push(hat) }

        })

        // Positions Executives correctly
        orgBoard.children.sort((a, b) => { return a.position - b.position })

        // Positions Divisions and Departments correctly
        orgBoard.children.forEach((divGroup) => {
            divGroup.children.sort((a, b) => { return a.position - b.position })
            divGroup.children.forEach((deptGroup) => {
                if (deptGroup.depts.length) {
                    deptGroup.depts.sort((a, b) => { return a.position - b.position })
                }
            })
        })

        if (!error) {
            resolve({ orgBoard, owner, deputy })
        } else {
            reject('something went wrong')
        }
    })
}

export default GetOrgBoard;
