function getBadge(value) {
    switch (value) {
        case "0":
            return '<span class="badge badge-pill uncertain-significance">Uncertain significance</span>';
        case "1":
            return '<span class="badge badge-pill not-provided">Not provided</span>';
        case "2":
            return '<span class="badge badge-pill benign">Benign</span>';
        case "3"  :
            return '<span class="badge badge-pill likely-benign">Likely benign</span>';
        case "4"  :
            return '<span class="badge badge-pill likely-pathogenic">Likely pathogenic</span>';
        case "5"  :
            return '<span class="badge badge-pill pathogenic">Pathogenic</span>';
        case "6"  :
            return '<span class="badge badge-pill drug-response">Drug response</span>';
        case "7"  :
            return '<span class="badge badge-pill histocompatibility">Histocompatibility</span>';
        case "255" :
            return '<span class="badge badge-pill other">Other</span>';
    }
    return "";
}

$(document).ready(function () {
    const query = $.query.get('query');

    if (query !== true) {
        $("#query").val(query);
    }

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
                }

                return JSON.stringify(data);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        },
        columnDefs: [{
            defaultContent: "-",
            targets: "_all"
        }],
        columns: [
            {data: 'referenceName'},
            {data: 'start'},
            {data: 'referenceBases'},
            {data: 'alternateBases'},
            {data: 'geneSymbol'},
            {data: 'snpIds'},
            {data: 'sampleCount'},
            {
                data: 'alleleFrequency',
                render: function (data) {
                    return data.map(x => x.toFixed(4));
                }
            },

            {
                data: 'clnsig',
                render: function (data) {
                    let regex = /(\d+)/;
                    let res = data;
                    while (regex.test(res)) {
                        res = res.replace(regex, getBadge(regex.exec(res)[1]));
                    }
                    return res;
                }
            },
            {
                data: 'coverage',
                render: function (data) {
                    return `min: ${data.min.toFixed(4)}, q25: ${data.q25.toFixed(4)}, median: ${data.median.toFixed(4)}, q75: ${data.q75.toFixed(4)}, max: ${data.max.toFixed(4)}, average: ${data.mean.toFixed(4)},`;
                }
            },
            {
                data: 'genotypeQuality',
                render: function (data) {
                    return `min: ${data.min.toFixed(4)}, q25: ${data.q25.toFixed(4)}, median: ${data.median.toFixed(4)}, q75: ${data.q75.toFixed(4)}, max: ${data.max.toFixed(4)}, average: ${data.mean.toFixed(4)}`;
                }
            },

            {data: 'assemblyId'},
            {data: 'datasetId'}
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