

let getPostTree = (flowChartData) => {
    console.log('fired!?!?');
        return new Promise((resolve, reject) => {
            let error = false
    
            let particle = Object.values(flowChartData).find(o => o.type === 'ed')
            let arr = Object.values(flowChartData)
    
            particle = {
                key: particle.id,
                position: particle.position,
                value: [particle.post, particle.id],
                title: particle.post,
                children: particle.children
            }
    
            arr.forEach((item, i) => {
                
                if (!item.section) {
                    arr.forEach((itemTwo, ii) => {
                        if (itemTwo.childOf === item.id && !itemTwo.section) {
                            if (!item.children.some(e => e.key === itemTwo.id)) {
                                item.children.push({
                                    key: itemTwo.id,
                                    position: itemTwo.position,
                                    value: [itemTwo.post, itemTwo.id],
                                    title: itemTwo.post,
                                    children: itemTwo.children
                                })
                            }
                        }
                    })
                }
            })
    
            if (!error) {
                particle.children.sort((a, b) => { return a.position - b.position })
                particle.children.map((exect) => {
                    exect.children.sort((a, b) => { return a.position - b.position })
                    exect.children.map((div) => {
                        div.children.sort((a, b) => { return a.position - b.position })
                        div.children.map((dept) => {
                            dept.children.sort((a, b) => { return a.position - b.position })
                        })
                    })
                })
                resolve([particle])
            } else {
                reject('something went wrong')
            }
    
        })
    }
    
    export default getPostTree;