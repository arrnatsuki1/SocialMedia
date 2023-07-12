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

    const messages = document.createElement('div')
    messages.setAttribute('class', 'messages')
    for (let i = 0; i < pubs.length; i++) {
        console.log("a")
        function createPubDiv(pub) {

            const pubinfotext = `${pub.creator.name} in ${pub.date}`
            const pubbodytext = pub.message
            /**
             * Para esto queda mejor hacer un objeto que sea una etiqueta mensaje
             * 
             */
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
            messages.appendChild(publication)
            return messages
        }

        pubs[i].forEach(element => {
            messages.appendChild(createPubDiv(element))
        });

        document.appendChild(messages )


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