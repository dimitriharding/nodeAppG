// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    //alert('hello');
    // Populate the user table on initial page load
    populateTable();

     $('ul.tabs').tabs();

    $('.modal-trigger').leanModal();

    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);


    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    //Save edit button
    $('#btnEditUser').on('click', editUser);

    $('#editbutton').on('click', function(event){
        //alert('Edit clicked');
        if( $('div#userInfoName').text() === 'Name' ){
            event.preventDefault();
            Materialize.toast('Select A User First...', 4000)
        }
        else{
            $('#modalEdit').openModal();
                
             // Prevent Link from Firing
                event.preventDefault();

                // Retrieve username from link rel attribute
                var thisId = $(this).attr('rel');

                // Get Index of object based on id value
                var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisId);

                 // Get our User Object
                var thisUserObject = userListData[arrayPosition];


                //Populate Info Box
                $('#editUserName').val(thisUserObject.username);
                $('#editUserEmail').val(thisUserObject.email);
                $('#editUserFullname').val(thisUserObject.fullname);
                $('#editUserAge').val(thisUserObject.age);
                $('#editUserGender').val(thisUserObject.gender);
                $('#editUserLocation').val(thisUserObject.location);
        }
    });

 $('.fixed-action-btn').click(function () {
          $("html, body").animate({
              scrollTop: 0
          }, 600);
          return false;
      });
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
    userListData = data.reverse();
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisId);

     // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    $('a#editbutton').attr('rel', thisId);

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'

        }).done(function( response, msg, status ) {
            //alert('test');
            // Check for successful (blank) response
            //console.log(status.status);
            if (status.status == 201) {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                Materialize.toast('User Added...', 4000, 'green darken-2');
                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
               // alert('Error: ' + response.msg);

                Materialize.toast('Error...'+ response.msg, 4000, 'red darken-3');
                //$('#addUser fieldset input').val('');


                // Update the table
                populateTable();

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser?id=' + $(this).attr('rel')
        }).done(function( response, msg, status ) {

            // Check for a successful (blank) response
           if (status.status == 200) {
                 Materialize.toast('User Deleted...', 4000, 'green darken-2');
            }
            else {
                 Materialize.toast('Error...'+ response.msg, 4000, 'red darken-3');
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Edit User
function editUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to edit this user?');

    var id = $('a#editbutton').attr('rel');
    console.log('id= ' + id);
    // Check and make sure the user confirmed
    if (confirmation === true) {

        var user = {
            'username': $('#editUserName').val(),
            'email': $('#editUserEmail').val(),
            'fullname': $('#editUserFullname').val(),
            'age': $('#editUserAge').val(),
            'location': $('#editUserLocation').val(),
            'gender': $('#editUserGender').val()
        }

        // If they did, do our edit
        $.ajax({
            type: 'PUT',
            data: user,
            url: '/users/edituser?id=' + id
        }).done(function( response, msg, status ) {

            console.log(status);
            // Check for a successful (blank) response
            if (status.status == 200) {
            
                Materialize.toast('User Edited...', 4000, 'green darken-2');
                
                //Reset selection
                $('#userInfoName').text('Name');
                $('#userInfoAge').text('Age');
                $('#userInfoGender').text('Gender');
                $('#userInfoLocation').text('Location');


                populateTable();
                 $('#modalEdit').closeModal();
                
            }
            else {
                 Materialize.toast('Error...'+ response.msg, 4000, 'red darken-3');
                
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};