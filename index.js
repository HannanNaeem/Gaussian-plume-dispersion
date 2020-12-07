// This example adds hide() and show() methods to a custom overlay's prototype.
// These methods toggle the visibility of the container <div>.
// overlay to or from the map.
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 17,
      center: { lat: 31.38063748, lng: 74.34728965},
      mapTypeId: "satellite",
    });
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(31.200007057, 74.15761462),
      new google.maps.LatLng(31.56030441, 74.52696487)
      
    );
    // let image = "https://developers.google.com/maps/documentation/javascript/";
    // image += "examples/full/images/talkeetna.png";
  
    let image = "overlay.png";


    /**
     * The custom USGSOverlay object contains the USGS image,
     * the bounds of the image, and a reference to the map.
     */
    class USGSOverlay extends google.maps.OverlayView {
      constructor(bounds, image) {
        super();
        this.bounds = bounds;
        this.image = image;
      }
      /**
       * onAdd is called when the map's panes are ready and the overlay has been
       * added to the map.
       */
      onAdd() {
        this.div = document.createElement("div");
        this.div.style.borderStyle = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";
        // Create the img element and attach it to the div.
        const img = document.createElement("img");
        img.src = this.image;
        img.style.width = "100%";
        img.style.opacity = "60%";
        img.style.height = "100%";
        img.style.position = "absolute";
        this.div.appendChild(img);
        // Add the element to the "overlayLayer" pane.
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div);
      }
      draw() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        const overlayProjection = this.getProjection();
        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        const sw = overlayProjection.fromLatLngToDivPixel(
          this.bounds.getSouthWest()
        );
        const ne = overlayProjection.fromLatLngToDivPixel(
          this.bounds.getNorthEast()
        );
  
        // Resize the image's div to fit the indicated dimensions.
        if (this.div) {
          this.div.style.left = sw.x + "px";
          this.div.style.top = ne.y + "px";
          this.div.style.width = ne.x - sw.x + "px";
          this.div.style.height = sw.y - ne.y + "px";
        }
      }
      /**
       * The onRemove() method will be called automatically from the API if
       * we ever set the overlay's map property to 'null'.
       */
      onRemove() {
        if (this.div) {
          this.div.parentNode.removeChild(this.div);
          delete this.div;
        }
      }
      /**
       *  Set the visibility to 'hidden' or 'visible'.
       */
      hide() {
        if (this.div) {
          this.div.style.visibility = "hidden";
        }
      }
      show() {
        if (this.div) {
          this.div.style.visibility = "visible";
        }
      }
      toggle() {
        if (this.div) {
          if (this.div.style.visibility === "hidden") {
            this.show();
          } else {
            this.hide();
          }
        }
      }
      toggleDOM(map) {
        if (this.getMap()) {
          this.setMap(null);
        } else {
          this.setMap(map);
        }
      }
    }
    const overlay = new USGSOverlay(bounds, image);
    overlay.setMap(map);
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle";
    toggleButton.classList.add("custom-map-control-button");
    const toggleDOMButton = document.createElement("button");
    toggleDOMButton.textContent = "Toggle DOM Attachment";
    toggleDOMButton.classList.add("custom-map-control-button");
    toggleButton.addEventListener("click", () => {
      overlay.toggle();
    });
    toggleDOMButton.addEventListener("click", () => {
      overlay.toggleDOM(map);
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);
  }
  