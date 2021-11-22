export const ONE_TO_ONE_UNI = 'OneToOneUni';
export const ONE_TO_ONE_BI = 'OneToOneBi';
export const ONE_TO_MANY_UNI = 'OneToManyUni';
export const ONE_TO_MANY_BI = 'OneToManyBi';
export const MANY_TO_ONE_UNI = 'ManyToOneUni';
export const MANY_TO_ONE_BI = 'ManyToOneBi';
export const MANY_TO_MANY_UNI = 'ManyToManyUni';
export const MANY_TO_MANY_BI = 'ManyToManyBi';

export const relationshipList = [
    { value: ONE_TO_ONE_UNI, label: <div className="vertical-center"><span className="relation"><span className="label">1</span><span className="sign">⟶</span><span className="label">1</span></span> &nbsp; One to One - Unidirectional</div> },
    { value: ONE_TO_ONE_BI, label: <div className="vertical-center"><span className="relation"><span className="label">1</span><span className="sign">⟷</span><span className="label">1</span></span> &nbsp; One to One - Bidirectional</div> },
    { value: ONE_TO_MANY_UNI, label: <div className="vertical-center"><span className="relation"><span className="label">1</span><span className="sign">⟶</span><span className="label">M</span></span> &nbsp; One to Many - Unidirectional</div> },
    { value: ONE_TO_MANY_BI, label: <div className="vertical-center"><span className="relation"><span className="label">1</span><span className="sign">⟷</span><span className="label">M</span></span> &nbsp; One to Many - Bidirectional</div> },
    { value: MANY_TO_ONE_UNI, label: <div className="vertical-center"><span className="relation"><span className="label">M</span><span className="sign">⟶</span><span className="label">1</span></span> &nbsp; Many to One - Unidirectional</div> },
    { value: MANY_TO_ONE_BI, label: <div className="vertical-center"><span className="relation"><span className="label">M</span><span className="sign">⟷</span><span className="label">1</span></span> &nbsp; Many to One - Bidirectional</div> },
    { value: MANY_TO_MANY_UNI, label: <div className="vertical-center"><span className="relation"><span className="label">M</span><span className="sign">⟶</span><span className="label">M</span></span> &nbsp; Many to Many - Unidirectional</div> },
    { value: MANY_TO_MANY_BI, label: <div className="vertical-center"><span className="relation"><span className="label">M</span><span className="sign">⟷</span><span className="label">M</span></span> &nbsp; Many to Many - Bidirectional</div> },
];