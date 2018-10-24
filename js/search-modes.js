$(document).ready(function () {
    $("#toggle-basic").click(function () {
        $("#advanced").hide();
        $("#basic").show();
    });

    $("#toggle-advanced").click(function () {
        $("#basic").hide();
        $("#advanced").show();
    });
});