export type Program = {
    sessions: Session[]
  }
  
  export type SessionLanguage = "no" | "en"
  
  export type SessionFormat = "presentation" | "lightning-talk" | "workshop"
  
  // export type Session = {
  //   intendedAudience: string
  //   length: string
  //   format: SessionFormat
  //   language: SessionLanguage
  //   abstract: string
  //   title: string
  //   room?: string
  //   startTime?: string
  //   endTime?: string
  //   video?: string
  //   startTimeZulu: string
  //   endTimeZulu: string
  //   id: string
  //   sessionId: string
  //   conferenceId: string
  //   startSlot: string
  //   startSlotZulu: string
  //   speakers: Speaker[]
  //   registerLoc?: string
  //   workshopPrerequisites?: string
  // }

  export type Session = {
    intendedAudience: string;
    length: string;
    format: string;
    language: string;
    abstract: string;
    title: string;
    id: string;
    sessionId: string;
    conferenceId: string;
    speakers: Speaker[];
    room?: string;
    startTime?: string;
    endTime?: string;
    video?: string;
    startTimeZulu?: string;
    endTimeZulu?: string;
    startSlot?: string;
    startSlotZulu?: string;
  };
  
  export type  Speaker = {
    name: string
    bio?: string
    twitter: string
  }
  