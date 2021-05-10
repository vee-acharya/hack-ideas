// export interface Challenge {
//   title: string;
//   description: string;
//   tags: string[];
//   id: string;
// }

interface Tag {
  label: string;
  id: string;
  value: boolean;
}

export class Challenge {
  constructor(
    public title: string = '',
    public description: string = '',
    public tags: Tag[] = [
      { label: 'Feature', id: 'isFeature', value: false },
      { label: 'Tech', id: 'isTech', value: false },
    ],
    public id: string = '',
    public creationDate: number = 0,
    public upvotes: number = 0,
    public upvotedBy: number[] = []
  ) {}
}
