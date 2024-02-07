import React, {useEffect, useState} from 'react';
import { TagsInput } from "react-tag-input-component";



const ReactTagsInput =()=> {

  const [tags, setTags] = useState(["Lorem"]);
  const [tags1, setTags1] = useState(["Lpsum"]);
  const [suggestions ,setSuggestions] = useState(["Children Care"]);


        return (
            <div>

                  <TagsInput
                  tags={tags}
                  tags1={tags1}
                  suggestions={suggestions}
                  value={[tags,tags1]}
                  placeHolder="Meta Keywords"
                />
            </div>
        )
    }

 
export default ReactTagsInput;