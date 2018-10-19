$(document).ready(function () {
    $("#query").val($.query.get('query'));

    const table = $('#result-table').DataTable({
        serverSide: true,
        processing: true,
        ordering: false,
        responsive: true,
        searching: false,
        ajax: {
            url: "https://bcbcloud.fcm.unicamp.br/bipmed/datatables",
            type: "POST",
            data: function (data) {
                const query = $("#query").val();

                data.query = {};

                if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.test(query)) {
                    const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.exec(query);
                    data.query.referenceName = regexResult[1];
                    data.query.start = regexResult[2];
                    data.query.end = regexResult[3];
                } else if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.test(query)) {
                    const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.exec(query);
                    data.query.referenceName = regexResult[1];
                    data.query.start = regexResult[2];
                } else if (/^\s*(rs\d+)\s*$/.test(query)) {
                    data.query.snpId = /^\s*(rs\d+)\s*$/.exec(query)[1].toLowerCase();
                } else if (/^\s*([A-Za-z0-9]+)\s*$/.test(query)) {
                    data.query.geneSymbol = /^\s*([A-Za-z0-9]+)\s*$/.exec(query)[1].toUpperCase();
                } else {
                    data = {};
                }

                return JSON.stringify(data);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (xhr, opts) {
                if (opts.data === "{}") {
                    xhr.abort();
                    $("div .dataTables_processing").hide();
                    if ($("#query").val() !== "") {
                        $("#result-table tbody").html('<tr class="odd"><td valign="top" colspan="11" class="dataTables_empty">Invalid query.</td></tr>');
                    }
                }
            }
        },
        columnDefs: [{
            defaultContent: "-",
            targets: "_all"
        }],
        columns: [
            {data: 'snpIds'},
            {data: 'geneSymbol'},
            {data: 'referenceName'},
            {data: 'start'},
            {data: 'referenceBases'},
            {data: 'alternateBases'},
            {data: 'sampleCount'},
            {data: 'alleleFrequency'},

            {data: 'clnsig'},
            {
                data: 'coverage',
                render: function (data) {
                    return `min: ${data.min}, q25: ${data.q25}, median: ${data.median}, q75: ${data.q75}, max: ${data.max}, average: ${data.mean},`;
                }
            },
            {
                data: 'genotypeQuality',
                render: function (data) {
                    return `min: ${data.min}, q25: ${data.q25}, median: ${data.median}, q75: ${data.q75}, max: ${data.max}, average: ${data.mean}`;
                }
            },

            {data: 'assemblyId'}
        ],
        language: {
            zeroRecords: "No variant found.",
            processing: "Searching for variants..",
            info: "Showing _START_ to _END_ of _TOTAL_ variants",
            infoFiltered: "(filtered from _MAX_ total variants)"
        }
    });

    new $.fn.dataTable.FixedHeader(table);
});