const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'card-container');

app.appendChild(container);

var request = new XMLHttpRequest()

request.open('GET', 'https://v2-api.sheety.co/3d913842befc1734ccdb0c9189fd1cb9/listoflinks/firstSheet/', true)
request.onload = function() {

  var data = JSON.parse(this.response)
  data = data['firstSheet']

  if (request.status >= 200 && request.status < 400) {

    data.forEach(row => {

      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const content = document.createElement('div');
      content.setAttribute('class', 'content');

      const h2 = document.createElement('h2');
      h2.textContent = row.title;

      const pTitle = document.createElement('p');
      const pMetaDescription = document.createElement('p');

      asyncCall()
      async function asyncCall () {

        try {
          let response = await fetch('https://cors-anywhere.herokuapp.com/'.concat(row.link));
          const text = await response.text();
          pTitle.textContent = text.match(/(?<=\<title>).*(?=\<\/title>)/);
          pMetaDescription.textContent = text.match(/(?<=\<meta name="description" content=).*(?=\>)/)

        } catch(e) {
            console.log(e);
            throw e;
        }
      }

      console.log(pMetaDescription.textContent.substring(pMetaDescription.textContent.length-5, pMetaDescription.textContent.length-1));
      if(pMetaDescription.textContent.substring(pMetaDescription.textContent.length-2, pMetaDescription.textContent.length-1) === '/') {
        pMetaDescription.textContent = pMetaDescription.textContent.substring(0, pMetaDescription.textContent.length-2);
      }

      const note = document.createElement('p');
      note.textContent = "Notes: "
      note.setAttribute('class', 'card-subheader');

      const pNotes = document.createElement('p');
      pNotes.textContent = row.notes;

      const linkSubHeader = document.createElement('p');
      linkSubHeader.textContent = "Link: "
      linkSubHeader.setAttribute('class', 'card-subheader');

      const a = document.createElement('a');
      var linkText = document.createTextNode(row.link);
      a.appendChild(linkText);
      a.href = row.link;
      a.target = "_blank"

      const linkInfo = document.createElement('p');
      linkInfo.textContent = "Additional Information Found: "
      linkInfo.setAttribute('class', 'card-subheader');

      container.appendChild(card);
      card.appendChild(content);
      content.appendChild(h2);
      content.appendChild(note);
      content.appendChild(pNotes);
      content.appendChild(linkSubHeader);
      content.appendChild(a);
      content.appendChild(linkInfo);

      if(pTitle != null) {
        content.appendChild(pTitle);
      }

      if(pMetaDescription != null) {
        content.appendChild(pMetaDescription);
      }

      const tagsContainer = document.createElement('div');
      tagsContainer.setAttribute('class', 'tags-container');
      content.appendChild(tagsContainer)

      const tagSubHeader = document.createElement('p');
      tagSubHeader.textContent = "Tags: ";
      tagSubHeader.setAttribute('class', 'tag-subheader');
      tagsContainer.appendChild(tagSubHeader);

      tagsArray = row.additionalTags.split(" ")
      tagsArray.forEach(tagItem => {

        const pTag = document.createElement('p');
        pTag.textContent = tagItem;
        pTag.setAttribute('class', 'tag');
        tagsContainer.appendChild(pTag)

      })


    })

  } else {
    console.log('error')
  }
}


request.send()
