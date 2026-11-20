import React,{useEffect,useRef} from 'react';
import {blockScroll} from '../scroll';
import {useAioCopy} from './i18n';
import FlipText from '../FlipText';
export function ImageLightbox({image,onClose}){const tr=useAioCopy(),dialog=useRef(null);useEffect(()=>{dialog.current.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';blockScroll(true);return()=>{document.body.style.overflow=old;blockScroll(false)}},[]);return <dialog data-lenis-prevent className="image-lightbox" ref={dialog} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget)onClose()}} aria-label={tr('Оригинал изображения')}><div className="lightbox-top"><span>{image.alt}</span><button className="text-action" onClick={onClose} aria-label={tr('Закрыть изображение')}><FlipText>{tr('Закрыть')}</FlipText></button></div><img src={image.src} alt={image.alt} draggable={false}/></dialog>}
