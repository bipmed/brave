$(document).ready(function () {
    var table = $('#result-table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "https://bcbcloud.fcm.unicamp.br/bipmed",
            type: "POST",
            data: function () {
                const query = $("#query").val();

                let data = {};

                if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.test(query)) {
                    const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.exec(query);
                    data.referenceName = regexResult[1];
                    data.start = regexResult[2];
                    data.end = regexResult[3];
                } else if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.test(query)) {
                    const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.exec(query);
                    data.referenceName = regexResult[1];
                    data.start = regexResult[2];
                } else if (/^\s*(rs\d+)\s*$/.test(query)) {
                    data.variantId = /^\s*(rs\d+)\s*$/.exec(query)[1].toLowerCase();
                } else if (/^\s*([A-Za-z0-9]+)\s*$/.test(query)) {
                    data.geneSymbol = /^\s*([A-Za-z0-9]+)\s*$/.exec(query)[1].toUpperCase();
                } else {
                    return JSON.stringify({});
                }
                return JSON.stringify(data);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            dataSrc: function (result) {
                const variants = result.variants;
                for (let i = 0; i < variants.length; i++) {
                    const variantId = variants[i].variantIds;
                    variants[i].variantIds = '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/snp/' + variantId + '">' + variantId + "</a>";
                    variants[i].coverage = [variants[i].minCov, variants[i].q25Cov, variants[i].medianCov, variants[i].q75Cov, variants[i].maxCov, variants[i].meanCov].join(', ');
                    variants[i].genQual = [variants[i].minGenQual, variants[i].q25GenQual, variants[i].medianGenQual, variants[i].q75GenQual, variants[i].maxGenQual, variants[i].meanGenQual].join(', ');
                }
                return variants;
            }
        },
        columnDefs: [{
            defaultContent: "-",
            targets: "_all"
        }],
        columns: [
            {data: 'variantIds'},
            {data: 'geneSymbol'},
            {data: 'referenceName'},
            {data: 'start'},
            {data: 'referenceBases'},
            {data: 'alternateBases'},
            {data: 'sampleCount'},
            {data: 'alleleFrequency'},

            {data: 'clnsig'},
            {data: 'coverage'},
            {data: 'genQual'},

            {data: 'assemblyId'}
        ],
        language: {
            zeroRecords: "No variant found."
        },
        bDestroy: true,
        responsive: true,
        paging: false,
        searching: false,
        sDom: "clear"
    });

    new $.fn.dataTable.FixedHeader(table);

    $("#search-button").click(function () {
        table.ajax.reload();
    });

    $('#query').keypress(function (e) {
        if (e.keyCode === 13)
            $('#search-button').click();
    });
});