/* ===== DATA + SHARED HELPERS ===== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const LET = "ABCDEFG", S = (n, c, o) => ({ name: n, code: c, out: o });
const PIPE = { Python: ["Input", "Array Creation", "Operations", "Analysis", "Output"], Data: ["Raw Data", "Collection", "Cleaning", "Transformation", "Feature Engineering", "Analysis", "Results"], Visualization: ["Raw Data", "Aggregation", "Encoding", "Plotting", "Styling", "Interpretation"], ML: ["Raw Data", "Preprocessing", "Split", "Training", "Prediction", "Evaluation", "Results"], Statistics: ["Raw Data", "Sampling", "Summary", "Test Selection", "Inference", "Conclusion"] };
const DOCS = { Python: "https://numpy.org/doc/stable/", Data: "https://pandas.pydata.org/docs/", Visualization: "https://matplotlib.org/stable/", ML: "https://scikit-learn.org/stable/", Statistics: "https://docs.scipy.org/doc/scipy/" };
// id, name, category, level, tools, keywords, description, dataset[records,features,numeric,categorical,missing], sub-experiments
const RAW = [
    ["01", "Python & NumPy Foundations", "Python", "Beginner", ["Python", "NumPy"], ["arrays", "vectorization", "numerical computing"], "Build numerical intuition with n-dimensional arrays, broadcasting and vectorised math.", [500, 8, 8, 0, 0], [
        S("Array Creation", "import numpy as np\na=np.arange(12).reshape(3,4)\nprint(a.shape,a.dtype)", "(3, 4) int64"),
        S("Indexing & Slicing", "print(a[1,2],a[:,1],a[a>6])", "6 [1 5 9] [ 7  8  9 10 11]"),
        S("Broadcasting", "print(a+np.array([10,20,30,40]))", "[[10 21 32 43]\n [14 25 36 47]\n [18 29 40 51]]"),
        S("Vectorized Math", "x=np.linspace(0,np.pi,5)\nprint(np.sin(x).round(2))", "[0.   0.71 1.   0.71 0.  ]"),
        S("Aggregations", "print(a.sum(),a.mean(axis=0))", "66 [4. 5. 6. 7.]"),
        S("Reshaping & Stacking", "b=a.ravel().reshape(2,6)\nprint(np.vstack([b,b]).shape)", "(4, 6)"),
        S("Random Sampling", "rng=np.random.default_rng(42)\nprint(rng.normal(0,1,3).round(3))", "[ 0.305 -1.04   0.75 ]")]],
    ["02", "Pandas Data Manipulation", "Data", "Beginner", ["Python", "Pandas"], ["dataframe", "groupby", "merge"], "Load, filter, group, merge and reshape tabular data with Pandas DataFrames.", [1200, 9, 5, 4, 0], [
        S("Loading CSV Data", "import pandas as pd\ndf=pd.read_csv('students.csv')\nprint(df.head(3))", "   id   name  marks\n0   1   Asha     82\n1   2   Ravi     74\n2   3  Meena     91"),
        S("Selecting & Filtering", "print(df[df.marks>80])", "   id   name  marks\n0   1   Asha     82\n2   3  Meena     91"),
        S("Sorting & Ranking", "print(df.sort_values('marks',ascending=False).head(2))", "   id   name  marks\n2   3  Meena     91\n0   1   Asha     82"),
        S("Grouping & Aggregation", "print(df.groupby('dept').marks.mean())", "dept\nCSE    80.5\nDS     84.2"),
        S("Merging Tables", "m=df.merge(depts,on='dept',how='left')\nprint(m.shape)", "(1200, 11)"),
        S("Pivot Tables", "print(pd.pivot_table(df,index='dept',columns='sem',values='marks'))", "sem     4     5\ndept\nCSE  78.1  80.2\nDS   83.0  85.4"),
        S("Applying Functions", "df['grade']=df.marks.apply(lambda m:'A' if m>=85 else 'B')\nprint(df.grade.value_counts())", "B    941\nA    259")]],
    ["03", "Data Cleaning", "Data", "Intermediate", ["Python", "Pandas"], ["missing values", "duplicates", "outliers", "preprocessing"], "Detect and repair quality problems: missing values, duplicates, wrong types and outliers.", [10000, 14, 10, 4, 126], [
        S("Inspecting Data Quality", "print(df.info())", "RangeIndex: 10000 entries\nColumns: 14 | dtypes: float64(10), object(4)"),
        S("Missing Value Treatment", "df['age']=df['age'].fillna(df['age'].median())\nprint(df.age.isna().sum())", "0"),
        S("Removing Duplicates", "n=len(df)\ndf=df.drop_duplicates()\nprint(n-len(df))", "14"),
        S("Fixing Data Types", "df['date']=pd.to_datetime(df['date'])\nprint(df.date.dtype)", "datetime64[ns]"),
        S("Outlier Detection (IQR)", "q1,q3=df.pay.quantile([.25,.75]);i=q3-q1\nprint((~df.pay.between(q1-1.5*i,q3+1.5*i)).sum())", "23"),
        S("Standardizing Text", "df['city']=df.city.str.strip().str.title()\nprint(df.city.unique()[:3])", "['Hyderabad' 'Chennai' 'Tirupati']"),
        S("Validation Rules", "assert df.age.between(0,100).all()\nprint('checks passed')", "checks passed")]],
    ["04", "Exploratory Data Analysis", "Statistics", "Intermediate", ["Python", "Pandas", "Seaborn"], ["eda", "correlation", "distribution", "summary statistics"], "Summarise a dataset, study distributions and correlations, and form hypotheses.", [8000, 12, 9, 3, 40], [
        S("Summary Statistics", "print(df.describe().T[['mean','std','min','max']].head(2))", "        mean    std  min    max\nage     34.2    9.1   18     65\npay    52000  18000  9000 190000"),
        S("Distribution Analysis", "print(df.pay.skew().round(2))", "1.34"),
        S("Correlation Matrix", "print(df[['age','pay','exp']].corr().round(2))", "       age   pay   exp\nage   1.00  0.62  0.91\npay   0.62  1.00  0.70\nexp   0.91  0.70  1.00"),
        S("Categorical Frequency", "print(df.dept.value_counts(normalize=True).round(2))", "IT     0.41\nHR     0.33\nOps    0.26"),
        S("Group Comparison", "print(df.groupby('dept').pay.median())", "dept\nHR     41000\nIT     58000\nOps    39500"),
        S("Missing Value Pattern", "print(df.isna().mean().round(3).head(3))", "age     0.004\npay     0.007\ncity    0.002"),
        S("Insight Summary", "print('Pay rises with experience (r=0.70)')", "Pay rises with experience (r=0.70)")]],
    ["05", "Data Visualization", "Visualization", "Intermediate", ["Python", "Matplotlib", "Seaborn"], ["charts", "plots", "matplotlib", "seaborn"], "Choose the right chart for the question and communicate findings clearly.", [3000, 7, 6, 1, 0], [
        S("Line Plot", "import matplotlib.pyplot as plt\nplt.plot(df.month,df.sales)\nplt.show()", "Line chart: sales trend over 12 months"),
        S("Bar Chart", "df.groupby('region').sales.sum().plot.bar()", "Bar chart: 4 regions compared"),
        S("Histogram", "plt.hist(df.pay,bins=30)", "Right-skewed histogram, 30 bins"),
        S("Scatter Plot", "plt.scatter(df.exp,df.pay,alpha=.4)", "Positive linear cloud"),
        S("Box Plot", "import seaborn as sns\nsns.boxplot(x='dept',y='pay',data=df)", "3 boxes; IT shows upper outliers"),
        S("Heatmap", "sns.heatmap(df.corr(numeric_only=True),annot=True)", "Correlation heatmap with annotations"),
        S("Subplot Dashboard", "fig,ax=plt.subplots(2,2,figsize=(10,8))", "2x2 figure grid created")]],
    ["06", "Statistical Analysis", "Statistics", "Intermediate", ["Python", "SciPy", "NumPy"], ["hypothesis testing", "t-test", "anova", "confidence interval"], "Apply inferential statistics: intervals, hypothesis tests and significance of relationships.", [600, 6, 5, 1, 0], [
        S("Descriptive Measures", "import numpy as np\nprint(np.mean(x),np.std(x,ddof=1))", "72.4 8.6"),
        S("Probability Distributions", "from scipy import stats\nprint(stats.norm.cdf(1.96).round(3))", "0.975"),
        S("Confidence Interval", "print(stats.t.interval(.95,len(x)-1,np.mean(x),stats.sem(x)))", "(70.2, 74.6)"),
        S("One-Sample t-test", "print(stats.ttest_1samp(x,70))", "t=2.1, p=0.037"),
        S("Chi-Square Test", "print(stats.chi2_contingency(table)[1])", "p=0.012"),
        S("One-Way ANOVA", "print(stats.f_oneway(a,b,c))", "F=5.4, p=0.006"),
        S("Correlation Significance", "print(stats.pearsonr(h,w))", "r=0.78, p<0.001")]],
    ["07", "Linear Regression", "ML", "Intermediate", ["Python", "scikit-learn"], ["regression", "prediction", "ridge", "lasso"], "Model continuous targets, check assumptions and control overfitting with regularisation.", [2500, 10, 10, 0, 0], [
        S("Train-Test Split", "from sklearn.model_selection import train_test_split\nXtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,random_state=42)", "Train 2000 | Test 500"),
        S("Simple Regression", "from sklearn.linear_model import LinearRegression\nm=LinearRegression().fit(Xtr[['area']],ytr)", "coef=3.2 intercept=11.5"),
        S("Multiple Regression", "m=LinearRegression().fit(Xtr,ytr)\nprint(m.score(Xte,yte))", "R2=0.84"),
        S("Feature Scaling", "from sklearn.preprocessing import StandardScaler\nXs=StandardScaler().fit_transform(Xtr)", "mean~0, std~1"),
        S("Residual Analysis", "res=yte-m.predict(Xte)\nprint(res.mean().round(2))", "0.03"),
        S("Ridge & Lasso", "from sklearn.linear_model import Ridge\nprint(Ridge(alpha=1).fit(Xtr,ytr).score(Xte,yte))", "R2=0.85"),
        S("Making Predictions", "print(m.predict(Xte[:2]))", "[245.1 312.8]")]],
    ["08", "Classification", "ML", "Intermediate", ["Python", "scikit-learn"], ["classification", "logistic regression", "random forest", "svm"], "Train and compare classifiers on labelled data and read a confusion matrix.", [1500, 12, 10, 2, 0], [
        S("Logistic Regression", "from sklearn.linear_model import LogisticRegression\nm=LogisticRegression().fit(Xtr,ytr)", "accuracy=0.88"),
        S("K-Nearest Neighbours", "from sklearn.neighbors import KNeighborsClassifier\nk=KNeighborsClassifier(5).fit(Xtr,ytr)", "accuracy=0.86"),
        S("Decision Tree", "from sklearn.tree import DecisionTreeClassifier\nt=DecisionTreeClassifier(max_depth=4).fit(Xtr,ytr)", "accuracy=0.85"),
        S("Random Forest", "from sklearn.ensemble import RandomForestClassifier\nrf=RandomForestClassifier(200).fit(Xtr,ytr)", "accuracy=0.92"),
        S("Naive Bayes", "from sklearn.naive_bayes import GaussianNB\nnb=GaussianNB().fit(Xtr,ytr)", "accuracy=0.81"),
        S("Support Vector Machine", "from sklearn.svm import SVC\nsv=SVC(kernel='rbf').fit(Xtr,ytr)", "accuracy=0.90"),
        S("Confusion Matrix", "from sklearn.metrics import confusion_matrix\nprint(confusion_matrix(yte,rf.predict(Xte)))", "[[131  9]\n [ 15 145]]")]],
    ["09", "Clustering", "ML", "Advanced", ["Python", "scikit-learn"], ["unsupervised", "kmeans", "dbscan", "pca"], "Discover structure in unlabelled data with partitioning, hierarchical and density methods.", [900, 6, 6, 0, 0], [
        S("K-Means", "from sklearn.cluster import KMeans\nkm=KMeans(3,n_init=10).fit(X)", "3 clusters: 310 / 295 / 295"),
        S("Elbow Method", "print([KMeans(k).fit(X).inertia_ for k in range(1,6)])", "[1800, 820, 310, 270, 245]"),
        S("Silhouette Score", "from sklearn.metrics import silhouette_score\nprint(silhouette_score(X,km.labels_))", "0.61"),
        S("Hierarchical Clustering", "from sklearn.cluster import AgglomerativeClustering\nh=AgglomerativeClustering(3).fit(X)", "3 clusters"),
        S("DBSCAN", "from sklearn.cluster import DBSCAN\nd=DBSCAN(eps=.5).fit(X)", "2 clusters, 18 noise points"),
        S("PCA Projection", "from sklearn.decomposition import PCA\np=PCA(2).fit(X);print(p.explained_variance_ratio_.sum())", "0.87"),
        S("Cluster Profiling", "print(df.groupby(km.labels_).mean().round(1))", "Per-cluster feature means")]],
    ["10", "Model Evaluation & Tuning", "ML", "Advanced", ["Python", "scikit-learn"], ["metrics", "roc", "cross validation", "grid search"], "Measure model quality fairly and tune hyperparameters without leaking test data.", [4000, 15, 12, 3, 0], [
        S("Precision, Recall & F1", "from sklearn.metrics import classification_report\nprint(classification_report(yte,pred))", "precision 0.91  recall 0.89  f1 0.90"),
        S("ROC Curve & AUC", "from sklearn.metrics import roc_auc_score\nprint(roc_auc_score(yte,prob))", "0.95"),
        S("Cross-Validation", "from sklearn.model_selection import cross_val_score\nprint(cross_val_score(rf,X,y,cv=5).mean())", "0.91"),
        S("Grid Search", "from sklearn.model_selection import GridSearchCV\ng=GridSearchCV(rf,{'max_depth':[4,8]},cv=5).fit(X,y)", "best: max_depth=8"),
        S("Learning Curves", "from sklearn.model_selection import learning_curve", "Train 0.99 vs validation 0.90: mild overfit"),
        S("Pipelines", "from sklearn.pipeline import make_pipeline\npipe=make_pipeline(StandardScaler(),rf)", "Pipeline(2 steps)"),
        S("Saving the Model", "import joblib\njoblib.dump(pipe,'model.pkl')", "model.pkl saved")]]];
// Expand compact rows into the full experiment object shape
function build(r, custom) {
    const [id, name, category, level, technologies, keywords, description, d, subs] = r, lc = name.toLowerCase();
    return {
        id, name, category, level, technologies, keywords, description, custom: !!custom,
        dataset: { records: d[0], features: d[1], numeric: d[2], categorical: d[3], missing: d[4] },
        youtube: r.youtube || "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " tutorial"), github: r.github || "https://github.com/search?q=" + encodeURIComponent(name + " python"),
        dataUrl: "https://www.kaggle.com/datasets?search=" + encodeURIComponent(keywords[0] || name), docs: DOCS[category] || DOCS.Data,
        overview: description, aim: `To study ${lc} and apply it to a practical dataset.`,
        problemStatement: `Given a real-world dataset, use ${technologies.join(", ")} to carry out ${lc} and interpret the outcome.`,
        methodology: "Work through seven modules (A-G), each adding one step to the workflow.", analysis: "Compare each module's output with expectations and note anomalies.",
        results: `A validated, reproducible ${lc} workflow with documented outputs.`,
        architecture: PIPE[category] || PIPE.Data,
        subExperiments: subs.map((s, i) => {
            const sid = String(+id || id) + LET[i]; return {
                id: sid, name: s.name, tools: technologies,
                aim: `To perform ${s.name.toLowerCase()} within ${lc}.`, problemStatement: `Apply ${s.name.toLowerCase()} to the experiment dataset and verify the result.`,
                explanation: `${s.name} is step ${i + 1} of 7 in this experiment. It builds on the previous modules and prepares data or results for the next.`,
                procedure: ["Load the dataset or the output of the previous module.", `Write the ${s.name.toLowerCase()} code shown below.`, "Run it and compare the output with the expected console output.", "Record observations and note any anomalies."],
                code: s.code, input: `Dataset with ${d[0].toLocaleString()} records and ${d[1]} features.`, result: s.out,
                analysis: `The output confirms that ${s.name.toLowerCase()} behaves as expected on this data.`, conclusion: `${s.name} was completed and its output feeds the next module.`
            }
        })
    }
}
const customList = () => store.get("custom", []);
const EXPERIMENTS = RAW.map(r => build(r)).concat(customList());
const byId = id => EXPERIMENTS.find(e => e.id === id);
/* completion tracking: {"6A":true} */
const done = () => store.get("done", {});
function progress(e) { const d = done(), n = e.subExperiments.filter(s => d[s.id]).length, t = e.subExperiments.length; return { n, t, pct: t ? Math.round(n / t * 100) : 0 } }
function status(e) { const p = progress(e); return p.n === 0 ? "AVAILABLE" : p.n === p.t ? "COMPLETED" : "IN PROGRESS" }
/* theme + shared header/footer */
function setTheme(t) { document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); const b = $("#themeBtn"); if (b) { b.textContent = t === "dark" ? "☾" : "☀"; b.setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " theme") } }
setTheme(localStorage.getItem("theme") || "dark");
function chrome(active) {
    $("#hdr").innerHTML = `<a class="brand" href="index.html"><b>MBU</b><span>Data Science Lab</span></a>
<button class="burger" id="burger" aria-label="Toggle menu" aria-expanded="false">☰</button>
<nav id="nav" aria-label="Main">${[["Command Center", "top"], ["Experiments", "explorer"], ["Learning Path", "pipeline"], ["Resources", "resources"]].map(([t, k]) => `<a href="index.html#${k}" data-k="${k}" class="${active === k ? "on" : ""}">${t}</a>`).join("")}</nav>
<div class="hr"><button id="themeBtn" class="ib"></button><a class="prof" href="index.html#badge">Student Profile</a></div>`;
    $("#ftr").innerHTML = `<strong>MOHAN BABU UNIVERSITY</strong><p>Data Science Laboratory · Academic Experiment Portal</p><p>© 2026 Mohan Babu University · Data Science Department</p>`;
    setTheme(document.documentElement.dataset.theme);
    $("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    $("#burger").onclick = e => { const o = $("#nav").classList.toggle("open"); e.target.setAttribute("aria-expanded", o) }
}
