import Quill, {QuillOptions} from 'quill'
import {Delta, Op} from 'quill/core'
import 'quill/dist/quill.snow.css'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Button} from "@/components/ui/button";
import {PiTextAa} from "react-icons/pi";
import {ImageIcon, Smile, SmileIcon, XIcon} from "lucide-react";
import {MdSend} from "react-icons/md";
import Hint from "@/components/hint";
import {MutableRefObject} from "react";
import {cn} from "@/lib/utils";
import EmojiPopover from "@/components/emoji-popover";
import Image from "next/image";
type EditorValue = {
    image: File | null,
    body:string
}

interface EditorProps {
    onSubmit: ({image, body}: EditorValue) => void;
    onCancel?: () => void;
    variant?: 'create' | 'update',
    placeholder?:string;
    defaultValue: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({variant = 'create', onCancel, onSubmit, placeholder='write something', defaultValue= [], disabled=false, innerRef}: EditorProps) => {

    const [text, setText] = useState('')
    const [isToolbarVisible, setIsToolbarVisible] = useState(true)
    const [image, setImage] = useState<File | null>(null)
    const submitRef = useRef(onSubmit)
    const containerRef =useRef<HTMLDivElement>(null)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef =useRef(defaultValue)
    const disableRef = useRef(disabled)
    const imageElementRef = useRef<HTMLInputElement>(null)
    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disableRef.current = disabled
    })

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef?.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [ [ 'bold', 'italic', 'strike'], ['link'], [{list: 'ordered'}, {list: 'bullet'}] ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 13, // или 'Enter'
                            handler: () => {
                                const text = quill.getText()
                                const addedImage =imageElementRef.current?.files?.[0] || null;
                                const isEmpty = !addedImage &&  text.replace(/<(.|\n)*?>/g, '').trim().length === 0

                                if (isEmpty) return;

                                const body = JSON.stringify(quill.getContents())

                                submitRef.current?.({body, image: addedImage})

                            }
                        },
                        shift_enter: {
                            key: 13,
                            shiftKey: true,
                            handler: (range, context) => {
                                quill.insertText(range.index, "\n");
                            }
                        }
                    }
                }
            }
        }


        const quill = new Quill(editorContainer, options);
        quillRef.current = quill
        quillRef.current.focus() //focusing on input

        if (innerRef) {
            innerRef.current = quill
        }

        quill.setContents(defaultValueRef.current)
        setText(quill.getText())
        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText())
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE)

            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null
            }
            if (innerRef) {
                innerRef.current = null
            }
        }
    }, [innerRef])


    const toggleToolbar = () => {
        setIsToolbarVisible((current) => !current)

        const toolbarElement = containerRef?.current?.querySelector('.ql-toolbar')

        if (toolbarElement) {
            toolbarElement.classList.toggle('hidden')
        }

    }


    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0
    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current
        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
    }


    return (
        <div className='flex flex-col '>
            <input className='hidden' type="file" accept='image/*' ref={imageElementRef}
                   onChange={(event) => setImage(event.target?.files![0])}/>
            <div className={cn('flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
                disabled && 'opacity-50'
                )}>
                <div ref={containerRef} className='h-full ql-custom'/>
                {!!image && (
                    <div className='p-2'>
                        <div className='relative size-[62px] flex items-center justify-center group'>

                                <button onClick={() => {
                                    setImage(null)
                                    imageElementRef.current!.value = ''
                                }} className='hidden group-hover:flex rounded-full bg-black/70 hover:bg-black absolute
                            -top-2.5 -right-2.5 text-white  size-6 z-4 border-2 border-white items-center justify-center'>
                                    <XIcon className='size-3.5'/>
                                </button>



                            <Image src={URL.createObjectURL(image)} alt='uploaded' fill
                                   className='rounded-xl border object-cover overflow-hidden '/>
                        </div>
                    </div>
                )}
                <div className='flex px-2 py-2  z-[5] items-center justify-end'>
                    <Hint label={isToolbarVisible ? 'hide formating' : 'show formating'}>
                        <Button disabled={disabled} size='sm' onClick={toggleToolbar} variant='ghost' >
                            <PiTextAa className='size-4'/>
                        </Button>
                    </Hint>
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button disabled={disabled} size='sm' variant='ghost' >
                            <SmileIcon className='size-4'/>
                        </Button>
                    </EmojiPopover>

                    {variant === 'create' &&        <Hint label='image'>
                        <Button onClick={() => imageElementRef.current?.click()} disabled={disabled} size='sm' variant='ghost' >
                            <ImageIcon className='size-4'/>
                        </Button>
                    </Hint>}
                    {variant === 'update' && (
                        <div className='ml-auto flex items-center gap-x-2'>
                            <Button onClick={onCancel} variant='outline' size='sm' disabled={disabled}>
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image
                                })
                            }} variant='outline' size='sm' className=' bg-[#007a5a] hover:bg-[#007a5a] text-white'
                                    disabled={disabled || isEmpty}>
                                Сохранить
                            </Button>
                        </div>
                    )}
                    {variant === 'create' && <Hint label='send'>

                        <Button  size='sm' disabled={disabled || isEmpty} onClick={() => {
                            onSubmit({
                                body: JSON.stringify(quillRef.current?.getContents()),
                                image
                            })
                        }} className={cn('ml-auto ', isEmpty ? 'bg-white hover:bg-[#007a5a] text-muted-foreground' : 'bg-[#007a5a] hover:bg-[#007a5a] text-white' )}>
                            <MdSend className='size-4'/>
                        </Button>

                    </Hint>}



                </div>

            </div>
            {variant === 'create' && (
                <div className={ cn('p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
                    !isEmpty && 'opacity-100'
                )}>
                    <p>
                        <strong>Shift + Return</strong> для перехода на след. строку
                    </p>
                </div>
            )}


        </div>
    )
}
export default Editor
