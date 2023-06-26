import React, { useRef, useEffect  } from 'react';
import { useParams, Link } from "react-router-dom";
import WebViewer from '@pdftron/webviewer';
import './App.css';

const Pdf = () => {

  const {type}  = useParams(); 
  const {id}  = useParams();

  
  const url = `https://resolutecontracts.com/cloud/api/pdf-file/${type}/${id}`;

  fetch(url)
  .then(response => response.blob())
  .then(data => { 
     const pdfUrl = URL.createObjectURL(data);

    loadPDF(pdfUrl);
  })
  .catch(error => {
    console.error('Error fetching PDF:', error);
  });


    function loadPDF(pdfUrl) {

        WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: pdfUrl,
        licenseKey: '',  // sign up to get a free trial key at https://dev.apryse.com
    

      },
      viewer.current,
    ).then((instance) => {
       
      const { documentViewer, annotationManager, Annotations } = instance.Core;


      documentViewer.addEventListener('annotationsLoaded', () => {
        const annots = annotationManager.getAnnotationsList();

        // remove annotations
        annotationManager.deleteAnnotations(annots);
      });


      documentViewer.addEventListener('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser()
        });

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);


        instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);

          instance.UI.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 21H19C20.103 21 21 20.103 21 19V8C21 7.735 20.895 7.48 20.707 7.293L16.707 3.293C16.52 3.105 16.266 3 16 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21ZM15 19H9V14H15V19ZM13 7H11V5H13V7ZM5 5H7V9H9H11H13H14H15V5H15.586L19 8.414L19.001 19H17V14C17 12.897 16.103 12 15 12H9C7.897 12 7 12.897 7 14V19H5V5Z" fill="#868E96"></path></svg>',
                title: 'save',
                onClick: async () => {
                  const doc = documentViewer.getDocument();
                  const xfdfString = await annotationManager.exportAnnotations();
                  const data = await doc.getFileData({
                    // saves the document with annotations in it
                    xfdfString
                  });
                  const arr = new Uint8Array(data);
                  const blob = new Blob([arr], { type: 'application/pdf' });
                
                    var formdata = new FormData();
                    formdata.append("document", blob, "document");

                        var requestOptions = {
                          method: 'POST',
                          body: formdata,
                          redirect: 'follow'
                        };

                        const url2 = `https://resolutecontracts.com/cloud/api/user/edit-contract/${type}/${id}`;

                        fetch(url2, requestOptions)
                          .then(response => response.text())
                          .then(result => alert("Edited successfully! Click Go back to flow button to go back to the flow."))
                          .catch(error => console.log('error', error));
               
                  
                }
            });
          });


      });
    });
    }


  const viewer = useRef(null);
  useEffect(() => {
  
  }, []);

  return (
    <div className="App">
      <div className="header">Resolute
          <Link className="back_btn" to={`https://resolutecontracts.com/cloud/user/start-workflow/${type}/${id}`} >Go back to flow</Link>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default Pdf;
