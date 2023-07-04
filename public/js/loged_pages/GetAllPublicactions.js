const uuid = document.cookie
    .split("; ")
    .find((row) => row.startsWith("uuid="))
    ?.split("=")[1];

const uri = '/pubs/' + uuid


window.addEventListener('load', () => {
    getSomePublications().then(
        render
    )
})

const render = function (pubs) {

    for (let i = 0; i < pubs.length; i++) {

        function createPubDiv(pub) {

            const pubinfotext = `${pub.creator.name} in ${pub.date}`
            const pubbodytext = pub.message

            let publication = document.createElement('div')
            publication.setAttribute('class', 'publication')
            let pubinfo = document.createElement('a')
            pubinfo.setAttribute('href', "/user/"+pub.creator.username)
            pubinfo.setAttribute('class', 'pub-info')
            publication.appendChild(pubinfo)
            let pubbody = document.createElement('div')
            pubbody.setAttribute('class', 'pub-body')
            publication.appendChild(pubbody)
            pubbody.appendChild(
                document.createTextNode(pubbodytext)
            )
            pubinfo.appendChild(
                document.createTextNode(pubinfotext)
            )
            return publication
        }

        pubs[i].forEach(element => {
            const pub = createPubDiv(element)
            document.body.appendChild(pub)
        });


    }

}

const getSomePublications = async function () {
    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}