export type PathConfig = {
  request?: {
    headers: Record<string, string | RegExp>;
  };

  response: TextResponse
    | JsonResponse
    | ObjectResponse
    ;
}

export type TextResponse = {
  text: string;
}

export type JsonResponse = {
  json: Record<string, unknown>;
}

export type ObjectResponse = {
  data: unknown;
}

const pc: PathConfig = {
  response: {
    text: 'hello',
    json: {

    },
  },
}