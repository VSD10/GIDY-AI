'use client';
import styles from './Timeline.module.css';
import { IconPlusCircle, IconBriefcase, IconGraduationCap, IconAward, IconMoreVertical } from '@/components/Icons';

export function Experience({ experiences, onEdit, isPublicView }) {
    return (
        <div className={`card ${styles.timelineCard}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Experience</h3>
                {!isPublicView && (
                    <button className={styles.addBtn} onClick={onEdit} title="Add Experience">
                        <IconPlusCircle size={18} />
                    </button>
                )}
            </div>

            <div className={styles.timelineList}>
                {experiences?.map((exp) => (
                    <div key={exp.id} className={styles.timelineItem}>
                        <div className={styles.iconCol}>
                            <div className={styles.companyIcon}><IconBriefcase size={18} color="var(--accent-color)" /></div>
                            <div className={styles.line}></div>
                        </div>

                        <div className={styles.contentCol}>
                            <div className={styles.itemHeader}>
                                <h4 className={styles.itemTitle}>{exp.title}</h4>
                                {!isPublicView && <button className={styles.moreBtn} onClick={onEdit}><IconMoreVertical size={16} /></button>}
                            </div>
                            <div className={styles.itemSubtitle}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                            <div className={styles.itemDates}>Started: {exp.startDate} - Ended: {exp.endDate || 'Present'}</div>
                        </div>
                    </div>
                ))}
                {(!experiences || experiences.length === 0) && (
                    <p className="text-muted text-sm">No experience added yet.</p>
                )}
            </div>
        </div>
    );
}

export function Education({ educations, onEdit, isPublicView }) {
    return (
        <div className={`card ${styles.timelineCard}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Education</h3>
                {!isPublicView && (
                    <button className={styles.addBtn} onClick={onEdit} title="Add Education">
                        <IconPlusCircle size={18} />
                    </button>
                )}
            </div>

            <div className={styles.timelineList}>
                {educations?.map((edu) => (
                    <div key={edu.id} className={styles.timelineItem}>
                        <div className={styles.iconCol}>
                            <div className={styles.companyIcon}><IconGraduationCap size={18} color="var(--accent-color)" /></div>
                            <div className={styles.line}></div>
                        </div>

                        <div className={styles.contentCol}>
                            <div className={styles.itemHeader}>
                                <h4 className={styles.itemTitle}>{edu.degree}</h4>
                                {!isPublicView && <button className={styles.moreBtn} onClick={onEdit}><IconMoreVertical size={16} /></button>}
                            </div>
                            <div className={styles.itemSubtitle}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                            <div className={styles.itemDates}>{edu.startDate} - {edu.endDate || 'Present'}</div>
                        </div>
                    </div>
                ))}
                {(!educations || educations.length === 0) && (
                    <p className="text-muted text-sm">No education added yet.</p>
                )}
            </div>
        </div>
    );
}

export function Certification({ certifications, onEdit, isPublicView }) {
    return (
        <div className={`card ${styles.timelineCard}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Certification</h3>
                {!isPublicView && (
                    <button className={styles.addBtn} onClick={onEdit} title="Add Certification">
                        <IconPlusCircle size={18} />
                    </button>
                )}
            </div>

            <div className={styles.timelineList}>
                {certifications?.length > 0 ? (
                    certifications.map((cert) => (
                        <div key={cert.id} className={styles.timelineItem}>
                            <div className={styles.iconCol}>
                                <div className={styles.companyIcon}><IconAward size={18} color="var(--accent-color)" /></div>
                                <div className={styles.line}></div>
                            </div>

                            <div className={styles.contentCol}>
                                <div className={styles.itemHeader}>
                                    <h4 className={styles.itemTitle}>{cert.name}</h4>
                                    {!isPublicView && <button className={styles.moreBtn} onClick={onEdit}><IconMoreVertical size={16} /></button>}
                                </div>
                                <div className={styles.itemSubtitle}>{cert.issuer}</div>
                                {cert.date && <div className={styles.itemDates}>Issued: {cert.date}</div>}
                            </div>
                        </div>
                    ))
                ) : (
                    !isPublicView && (
                        <div className={styles.emptyPrompt} onClick={onEdit}>
                            <IconAward size={16} /> <span>Add Your Certifications!</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
