# Search application for BIPMed website

Supported queries:

- Gene symbol (SCN1A),
- Genomic range (1:1000-2000),
- Genomic position (1:1000),
- SNPdb ID (rs6054257)

This application consumes [BIPMed Server API](https://github.com/bipmed/bipmed-server).

- `SearchInput`
    - `draw` Draw counter, used by DataTables
    - `start` Paging first record indicator
    - `length` Number of records that the table can display in the current draw, 0 for all records
    - `queries` List of queries
- `Query`
    - `snpId` external variant id, normally from dbSNP database (rs35735053)
    - `assemblyId` reference genome version (GRCh38)
    - `callSetId` call set id (bipmed-wes-phase2)
    - `referenceName` chromosome name (chr1, 1)
    - `start` start position, 0-based (7737651)
    - `end` end position (70000)
    - `geneSymbol` gene symbol (SCN1A)
    
- `SearchResponse`
    - `draw` The draw counter that this object is a response to, used by DataTables
    - `recordsTotal` Total records, before filtering
    - `recordsFiltered` Total records, after filtering
    - `data` List of variants that matched one (or more) search query
    - `error` If an error occurs during the running of the server-side processing
- `Variant`
    - `callSetId` call set id
    - `totalSamples` number of samples in this call set
    - `assemblyId` reference genome version of this call set
    - `snpIds` list of dbSNP ids
    - `referenceName` chromosome name
    - `start` start position, 0-based
    - `referenceBases` reference bases, genome
    - `alternateBases` list of alternate bases, variant
    - `geneSymbols` list of gene names
    - `alleleFrequencies` list of allele frequencies, one per alternate bases
    - `sampleCount` number of samples in the call set that have this variant
    - `coverage` distribution of coverage
    - `genotypeQuality` distribution of genotype quality
    - `clnsig` clinical significances
    - `hgvs` list of HGVS nomenclatures, one per alternate bases
    - `type` list of variant types, one per alternate bases