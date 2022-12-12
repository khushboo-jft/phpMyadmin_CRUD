$(document).ready(function () {
    let hid;
    let count = 0;
    let empData = [];
    const id = document.getElementById('isbn');

    login();
    getCookie("token");




    $('#table').on('click', '.btn-edit', function () {
        hid = this.id;
        count = hid;
        console.log(hid);

        $.ajax({
            url: `http://localhost:8000/emp/${hid}`,
            method: 'GET',
            headers: {
                // authorization: sessionStorage.getItem("key")
                authorization: cookies
            },
            success: function (product) {
                console.log(product)

                $("#names").val(product.names);
                $("#job").val(product.job);
                $("#salary").val(product.salary);
                $("#addbtn").hide();
                $("#savebtn").show();
            }
        })
    });
    $("#table").on('click', '.btn-delete', function () {
        hid = this.id;
        console.log(hid);
        $.ajax({
            url: `http://localhost:8000/emp/${hid}`,
            method: 'DELETE',
            headers: {
                // authorization: sessionStorage.getItem("key")
                authorization: cookies
            },
            success: function () {
                loadData();

            }
        })

    });
    $('#addbtn').click(function () {
        var names = $("#names").val();
        var job = $("#job").val();
        var salary = $("#salary").val();
        $.ajax({
            url: "http://localhost:8000/emp",
            method: 'POST',

            headers: {
                // authorization: sessionStorage.getItem("key")
                authorization: cookies
            },
            data: {
                id: empData.length + 1,
                'names': names,
                'job': job,
                'salary': parseInt(salary)
            },
            success: function (response) {
                clearForm();
                loadData(response);
                console.log(response);
            }
        })
    }) /
        $("#savebtn").click(function () {
            debugger;
            var names = $("#names").val();
            var job = $("#job").val();
            var salary = $("#salary").val();
            // const id = $(this).parent().parent().find("#names").attr("data-id");

            // var id]=$("#names").attr

            console.log(count)

            $.ajax({
                url: `http://localhost:8000/emp/${count}`,
                method: 'PUT',
                headers: {
                    // authorization: sessionStorage.getItem("key")
                    authorization: cookies
                },
                data: {

                    names: names,
                    job: job,
                    salary: salary,
                },
                success: function (response) {
                    clearForm()
                    loadData(response);
                }
            })
        });
    function clearForm() {
        $("#names").val("");
        $("#job").val("");
        $("#salary").val("");
        $("#addbtn").show();
        $("#savebtn").hide();
    }



    let cookies = getCookie('token');
    console.log(cookies);
    function loadData() {
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/emp",
            beforeSend: clearForm(),
            
            headers: {
                // authorization: sessionStorage.getItem("key")
                // xhrFields: { withCredentials: true },
                "authorization": cookies
                
            },
            // crossDomain: true,
            success: function (arr) {
                empData = arr;

                $("#empDetails").html("");
                arr.forEach((i) => {
                    let tabb = `<tr>
                
        <td>${i.names}</td>
        <td>${i.job}</td>
        <td>${i.salary}</td>
        <td><button class='btn btn-sm btn-success btn-edit' id="${i.id}">Edit</button>
            <button class='btn btn-sm btn-success btn-delete' id="${i.id}">Delete</button>
        </td></tr>`
                    $("#empDetails").append(tabb)
                })
            }
        })
    }
    (() => {

        loadData(JSON.parse(localStorage.getItem("data")) || [])

    })();


    // function getCookie(name) {
    //     function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    //         var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    //         return match ? match[1] : null;
    // }

    function getCookie(name) {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
          let [k,v] = el.split('=');
          cookie[k.trim()] = v;
        })
        return cookie[name];
    }

    function login() {
        $.ajax({
            url: "http://localhost:8000/login",
            method: "POST",
            contentType: "application/json",
            success: function (token) {
               console.log(token,2);
               const expiry = 'Wed, 4 Feb 2023 12:00:00 UTC';
               document.cookie = `token=${token} ; expires=${expiry}`
               console.log("called")
            //    console.log( document.cookie='key= token; expires='+new Date(2022,12,1).toUTCString());
            }
        })
    }
})
