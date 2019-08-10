# BraVE is a web application to explore the [BIPMed](http://bipmed.org/) genomic variant dataset

Initially, the table shows the first 10 variants ordered by genomic position.
Change the number of showed variants at the top of the table to see more variants at same page (up to 100).
At the bottom of the table, use the navigation buttons to move throughout the table.

The table may show a plus sign at the beginning of each row.
It means that your screen could not show all columns.
Click on the plus sign to see all columns or zoom out.
When available, `dbSNP` column will present one or more links to [NCBI dbSNP](https://www.ncbi.nlm.nih.gov/snp/) database.
Some variants may have more than one `Alternative` allele, in this case they are separated by comma.

Some variants have clinical characteristic. When available, they are provided on `Clinical Significance`column.
They are many available values:

- <span class="badge badge-pill uncertain-significance">Uncertain</span>
- <span class="badge badge-pill not-provided">Not provided</span>
- <span class="badge badge-pill benign">Benign</span>
- <span class="badge badge-pill likely-benign">Likely benign</span>
- <span class="badge badge-pill likely-pathogenic">Likely pathogenic</span>
- <span class="badge badge-pill pathogenic">Pathogenic</span>
- <span class="badge badge-pill drug-response">Drug response</span>
- <span class="badge badge-pill histocompatibility">Histocompatibility</span>
- <span class="badge badge-pill other">Other</span>

You can search for variants by typing or pasting:

- Gene symbols (`SCN1A`, `BRCA1`)
- Genomic range (`1:65000-70000`, `X:2600000-2800000`)
- Genomic position (`1:7737651`, `5:2747603`)
- dbSNP ID (`rs35735053`, `rs80357323`)

The search system is case insensitive (`scn1a` will work) and ignores spaces (`1 : 65000 -70000` will work too, except for dbSNP IDs).
It supports for multiple queries separated by new line or comma.
Example: `SCN1A,1:65000-70000,1:7737651,rs35735053`. The <kbd>Shift</kbd>+<kbd>Enter</kbd> is a key binding for `Search Variants` button.
Search results can be shared by copying the URL.
For example: [http://bipmed.org/brave/index.html?queries=SCN1A%2C1:65000-70000%2C1:7737651%2Crs35735053](http://bipmed.org/brave/index.html?queries=SCN1A%2C1:65000-70000%2C1:7737651%2Crs35735053].

This project is part of the [Brazilian Initiative on Precision Medicine (BIPMed)](http://bipmed.org).
and the [Brazilian Institute of Neuroscience and Neurotechnology (BRAINN)](http://www.brainn.org.br/en/) institute,
developed by the [Laboratory of Biostatistics and Computational Biology (BCBLab)](https://github.com/labbcb")
with funding from [São Paulo Research Foundation (FAPESP)](http://www.fapesp.br/en/).
