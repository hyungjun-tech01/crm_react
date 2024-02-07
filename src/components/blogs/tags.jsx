import React, {useEffect, useState} from 'react';
import { TagsInput } from "react-tag-input-component";



const ReactTagsInput =()=> {

  const [tags, setTags] = useState(["Marketing"]);
  const [suggestions ,setSuggestions] = useState(["Children Care"]);


        return (
            <div>

                  <TagsInput
                  tags={tags}
                  suggestions={suggestions}
                  value={tags}
                  placeHolder="Enter Services"
                />
            </div>
        )
    }

 
export default ReactTagsInput;