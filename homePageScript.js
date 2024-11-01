document.addEventListener('DOMContentLoaded', function() {
    //Tool 01 interaction
    const gridItem4 = document.getElementById('grid-item-4'); // if hovered over
    const gridItem2 = document.getElementById('grid-item-2'); // change color of this

    gridItem4.addEventListener('mouseover', function() {
        gridItem2.style.color = '#14de1e';
    });

    gridItem4.addEventListener('mouseout', function() {
        gridItem2.style.color = '#000000';
    });

    //Tool 02 interaction
    const gridItem6 = document.getElementById('grid-item-6'); // if hovered over
    const gridItem5 = document.getElementById('grid-item-5'); // change color of this

    gridItem6.addEventListener('mouseover', function() {
        gridItem5.style.color = '#14de1e';
    });

    gridItem6.addEventListener('mouseout', function() {
        gridItem5.style.color = '#000000';
    });

    //Tool 03 interaction
    const gridItem8 = document.getElementById('grid-item-8'); // if hovered over
    const gridItem7 = document.getElementById('grid-item-7'); // change color of this

    gridItem8.addEventListener('mouseover', function() {
        gridItem7.style.color = '#14de1e';
    });

    gridItem8.addEventListener('mouseout', function() {
        gridItem7.style.color = '#000000';
    });

    // Thank you message
    const gridItem9 = document.getElementById('grid-item-9');
    const link = gridItem9.querySelector('a'); // Select the <a> tag within grid-item-9

    gridItem9.addEventListener('mouseover', function() {
        gridItem9.style.color = '#14de1e';
        if (link) {
            link.style.color = '#14de1e';
        }
    });

    gridItem9.addEventListener('mouseout', function() {
        gridItem9.style.color = '#000000';
        if (link) {
            link.style.color = '#000000';
        }
    });
});