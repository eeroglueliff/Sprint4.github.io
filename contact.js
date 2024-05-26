$(document).ready(function() {
    
    // Contact form submission handler
    $("#contact-form").submit(function(event) {
        event.preventDefault(); 
        var formData = $(this).serialize(); 
        
        $("#response-message").html("Teşekkürler, " + $("#name").val() + ", mesajınız gönderildi").fadeIn();
        $(this).trigger("reset");
        setTimeout(function() { $('#response-message').fadeOut(); }, 5000);
    });

    var events = {
        "2024-06-03": { title: "Yüzme Etkinliği", time: "14:00", location: "Bağlıca", description: "Bağlıca Spor Kompleksi'nde yüzme etkinliği düzenlenecektir." },
        "2024-05-29": { title: "Deneme Sınavı", time: "10:00", location: "8G Akademi", description: "Palme Yayinevi işbirliği ile 5,6,7 ve 8. Sınıflara özel deneme sınavı yapılacaktır." },
        "2024-06-15": { title: "Sinema Etkinliği", time: "20:00", location: "Bağlıca", description: "Akademimizin etkinlik salonunda öğrencilerimizle buluşuyoruz." }
    };

    // Initializing jQuery UI Tabs
    $(function() {
        $("#tabs").tabs();
      });

    // Initializing datepicker with event highlights
    $("#datepicker").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'yy-mm-dd',
        beforeShowDay: function(date) {
            var dateString = $.datepicker.formatDate('yy-mm-dd', date);
            if (events[dateString]) {
                return [true, "event-day", events[dateString].title];
            }
            return [true, "", ""];
        },
        onSelect: function(dateText) {
            if (events[dateText]) {
                showEventDetails(events[dateText]);
            }
        }
    });

    // Function to display event details in a dialog
    function showEventDetails(event) {
        var detailsHtml = `<h3>${event.title}</h3>
                           <p><strong>Zaman:</strong> ${event.time}</p>
                           <p><strong>Konum:</strong> ${event.location}</p>
                           <p><strong>Açıklama:</strong> ${event.description}</p>`;
        $("#event-details").html(detailsHtml);
        $("#event-details").dialog({ title: "Etkinlik Detayları", modal: true });
    }

    var currentIndex = 0;
    const photoList = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg', 'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg', 'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg', 'photo21.jpg'];

    // Initializing gallery with Masonry layout
    const gallery = $("#photo-Galeri");
    photoList.forEach(function(photo, index) {
        $('<img>', {
            src: photo,
            click: function() {
                currentIndex = index;
                updateImageInDialog(photo);
            }
        }).appendTo(gallery).on('load', function() {
            $('#photo-Galeri').masonry({
                itemSelector: 'img',
                columnWidth: 200,
                fitWidth: true
            });
        });
    });

    // Initializing image dialog
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        width: "auto",
        height: "auto",
        resizable: false,
        draggable: false,
        open: function() {
            $('.ui-widget-overlay').css({
                opacity: 0.8, 
                backgroundColor: "black" 
            });
            $('#prev').toggle(currentIndex >= 0);
            $('#next').toggle(currentIndex <= photoList.length - 1);
        },
        close: function() {
            $("#modal-image").attr('src', '');
        }
    });

    $('#next').click(function(e) {
        e.preventDefault();
        if (currentIndex < photoList.length - 1) {
            currentIndex++;
            updateImageInDialog(photoList[currentIndex]);
        }
    });

    $('#prev').click(function(e) {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateImageInDialog(photoList[currentIndex]);
        }
    });

    // Function to update image in dialog
    function updateImageInDialog(src) {
        $('#modal-image').attr('src', src);
        $("#dialog").dialog("option", "title", "Resim " + (currentIndex + 1)).dialog("open");
    }

    // Function to show teachers based on subject
    function showTeachers(subject) {
        $.ajax({
            url: "json_files/" + "teachers.json",
            dataType: 'json',
            success: function(data) {
                var teacherInfo = '<h3>' + subject.charAt(0).toUpperCase() + subject.slice(1) + ' Öğretmenleri</h3>';
                var filteredTeachers = data.teachers.filter(function(teacher) {
                    return teacher.subject.toLowerCase() === subject.toLowerCase();
                });

                if (filteredTeachers.length > 0) {
                    $.each(filteredTeachers, function(index, teacher) {
                        teacherInfo += '<p>' + teacher.name;
                    });
                } else {
                    teacherInfo += '<p>Bu ders için öğretmen bulunmamaktadır.</p>';
                }

                $('#teacher-info').html(teacherInfo);
            },
            error: function() {
                $('#teacher-info').html('<p>Öğretmen bilgileri yüklenemedi.</p>');
            }
        });
    }

    $('.subject-btn').click(function() {
        var subject = $(this).data('subject');
        showTeachers(subject);
    });

    showTeachers('Matematik');
    function clearLocalStorage() {
        localStorage.clear();
        console.log("Local storage cleared");
    }
   
    // Forum form submission handler
    $('#forum-form').submit(function(event){
        event.preventDefault();
        var name1 = $('#name1').val();
        var surname = $('#surname').val();
        var message = $('#forum-message').val();  

        var hiddenName = name1.length > 1 ? name1.charAt(0) + '*'.repeat(name1.length - 1) : name1;
        var hiddenSurname = surname.length > 1 ? surname.charAt(0) + '*'.repeat(surname.length - 1) : surname;

        console.log("Hidden Name:", hiddenName);
        console.log("Hidden Surname:", hiddenSurname);
        console.log("Message:", message);

        saveComment(hiddenName, hiddenSurname, message);

        $('#name1').val('');
        $('#surname').val('');
        $('#forum-message').val('');

        fetchComments(); 
    });

    function saveComment(name1, surname, message) {
        var comments = JSON.parse(localStorage.getItem('comments')) || [];
        var date = new Date().toLocaleString();
        comments.push({ name1: name1, surname: surname, message: message, date: date });
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function fetchComments() {
        var comments = JSON.parse(localStorage.getItem('comments')) || [];
        var commentsHtml = '';
        $.each(comments, function(index, comment){
            commentsHtml += '<div class="comment"><p><strong>' + comment.name1 + ' ' + comment.surname + ':</strong> ' + comment.message + '</p><small>' + comment.date + '</small></div>';
        });
        $('#comments-section').html(commentsHtml);
    }

    fetchComments(); 

    // Search form submission handler
    $('#search-form').submit(function(event){
        event.preventDefault();
        var query = $('#search-input').val().toLowerCase();
        performSearch(query);
    });

    // Function to perform search using AJAX
    function performSearch(query) {
        $.ajax({
            url: "json_files/" + 'data.json', 
            dataType: 'json',
            success: function(data) {
                var result = data.find(function(item) {
                    return item.title.toLowerCase().includes(query);
                });

                if (result) {
                    window.location.href = result.link;
                } else {
                    $('#search-results').html('<p>Arama kriterlerinize uygun sonuç bulunamadı.</p>').show();
                }
            },
            error: function() {
                $('#search-results').html('<p>Arama sonuçları yüklenemedi. Lütfen tekrar deneyin.</p>').show();
            }
        });
    }

    // Function to fetch and display books using AJAX with external website
    function fetchBooks() {
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=education&key=AIzaSyBFiTm6umt96QU_FmTmPKWdhZk9vjKZ7BU';

        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (data) {
                console.log('API Response:', data); 
                let booksHtml = '<div id="accordion">';
                data.items.forEach(book => {
                    booksHtml += `
                        <h3>${book.volumeInfo.title}</h3>
                        <div>
                            <p>${book.volumeInfo.description}</p>
                            <a href="${book.volumeInfo.infoLink}" target="_blank">Daha Fazla Bilgi</a>
                        </div>
                    `;
                });
                booksHtml += '</div>';
                $('#books-info').html(booksHtml);
                $('#accordion').accordion({
                    collapsible: true,
                    active: false 
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error:', textStatus, errorThrown); 
                $('#books-info').html('<p>Kitap bilgileri alınamadı. Lütfen tekrar deneyin.</p>');
            }
        });
    }

    fetchBooks();

    function clearLocalStorage() {
        localStorage.clear();
        console.log("Local storage cleared");
    }

    // Function to clear specific local storage key (comments)
    function clearComments() {
        localStorage.removeItem('comments');
        console.log("Comments data removed from local storage");
    }

    // Example usage: call this function to clear comments
    clearComments();
    
});
