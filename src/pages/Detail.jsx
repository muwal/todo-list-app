import React, { useEffect, useState } from 'react'

import { Modal } from 'flowbite';

import iconBack from '../assets/icon-back.svg'
import iconEdit from '../assets/icon-edit.svg'
import iconSort from '../assets/icon-sort.svg'
import iconAngle from '../assets/icon-angle.svg'
import IconPlus from '../assets/icon-plus.svg'
import IconDelete from '../assets/icon-delete.svg'
import iconAlert from '../assets/icon-alert.svg'
import iconAlertSm from '../assets/icon-alert-sm.svg'
import emptyItem from '../assets/empty-item.png'

import { BrowserRouter as Router, Link, useParams } from "react-router-dom";

import axios from 'axios'

export default function Detail() {

    const { id } = useParams();

    const bareUrl = 'https://todo.api.devcode.gethired.id/'

    const [message, setMessage] = useState(null);
    const [todos, setTodos] = useState(null);
    const [activityTitle, setActivityTitle] = useState(null)
    const [itemTitle, setItemTitle] = useState(null)
    const [textValue, setTextValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isEditItem, setIsEditItem] = useState(false);
    const [editItem, setEditItem] = useState({});
    const [classDropdownPriority, setClassDropdownPriority] = useState('hidden');
    const [classDropdownSort, setClassDropdownSort] = useState('hidden');
    const [todoId, setTodoId] = useState(null)
    const [todoTitle, setTodoTitle] = useState(null)
    const [sortOrder, setSortOrder] = useState("newest");

    const sortData = (sortOrder) => {
        switch (sortOrder) {
            case "newest":
                setTodos(todos.sort((a, b) => (a.id < b.id ? 1 : -1)));
                break;
            case "oldest":
                setTodos(todos.sort((a, b) => (a.id > b.id ? 1 : -1)));
                break;
            case "asc":
                setTodos(todos.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)));
                break;
            case "desc":
                setTodos(todos.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1)));
                break;
            case "unchecked":
                setTodos(todos.sort((a) => (a.is_active == 0 ? 1 : -1)));
                break;
            default:
                setTodos(todos.sort((a, b) => (a.id < b.id ? 1 : -1)));
                break;
        }
    };

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        sortData(value);
        setClassDropdownSort('hidden');
    };

    const handleItemChange = (item) => {
        setDataArray(item);
        setClassDropdownPriority('hidden')
    }

    const [priorities, setPriorities] = useState(
        [{
            priority: 'Very High',
            value: 'very-high',
            color: 'bg-red-500'
        },
        {
            priority: 'High',
            value: 'high',
            color: 'bg-amber-500'
        },
        {
            priority: 'Medium',
            value: 'normal',
            color: 'bg-green-500'
        },
        {
            priority: 'Low',
            value: 'low',
            color: 'bg-blue-500'
        },
        {
            priority: 'Very Low',
            value: 'very-low',
            color: 'bg-purple-500'
        },]
    );

    const getAllTodos = () => {
        axios.get(bareUrl + 'todo-items?activity_group_id=' + id)
            .then((response) => {
                const todos = response.data.data
                setTodos(todos);
            });
    }

    const getActivities = () => {
        axios.get(bareUrl + 'activity-groups/' + id)
            .then((response) => {
                setActivityTitle(response.data.title)
            });
    }

    const handleTitleItemChange = (event) => {
        setItemTitle(event.target.value);
    }

    const showDropdownPriority = () => {
        setClassDropdownPriority('block');
    };

    const hideDropdownPriority = () => {
        setClassDropdownPriority('hidden');
    };

    const showDropdownSort = () => {
        setClassDropdownSort('block');
    };

    const hideDropdownSort = () => {
        setClassDropdownSort('hidden');
    };

    const displayTodos = (todos) => {
        if (!todos) {
            return false;
        }

        if (todos.length > 0) {
            return (
                todos.map((item, index) => {
                    var warna = '';

                    if (item.priority == 'very-high') {
                        warna = 'bg-red-500';
                    } else if (item.priority == 'high') {
                        warna = 'bg-amber-500';
                    } else if (item.priority == 'normal') {
                        warna = 'bg-green-500';
                    } else if (item.priority == 'low') {
                        warna = 'bg-blue-500';
                    } else if (item.priority == 'very-low') {
                        warna = 'bg-purple-500';
                    }
                    return (
                        <div className="bg-white rounded-2xl shadow-md p-8 flex items-center" key={index} data-cy="todo-item">
                            <input type="checkbox" className="mr-6 h-5 w-5 checked:bg-cyan" id={'todoItem' + index} data-cy="todo-item-checkbox" onChange={() => { toggleStatus(item) }} checked={!item.is_active} />
                            <div className={`h-3 w-3 mr-4 rounded-full ` + warna} data-cy="todo-item-priority-indicator"></div>
                            <div className={item.is_active ? 'font-semibold text-lg' : 'font-semibold text-lg line-through text-slate-500'} data-cy="todo-item-title">
                                {item.title}
                            </div>
                            <button data-cy="todo-item-edit-button" onClick={() => { editTodo(item) }} className='ml-3'>
                                <img src={iconEdit} alt="icon edit" />
                            </button>
                            <button onClick={() => showDeleteTodoModal(item)} data-cy="todo-item-delete-button" className='ml-auto'>
                                <img src={IconDelete} alt="icon delete" />
                            </button>
                        </div>
                    );
                })
            )
        } else {
            return (
                <img src={emptyItem} alt="empty" className="mx-auto" data-cy="todo-empty-state" />
            );
        }
    }

    const handleAddTodo = () => {
        setTextValue('')
        setDataArray({})
        setIsEditItem(false)
        setClassDropdownSort('hidden');

        addTodoModal.show()
    }

    const handleCloseAdd = () => {
        addTodoModal.hide()
    }

    const handleTextChange = (event) => {
        setTextValue(event.target.value);
    }

    const handleSave = () => {
        if (isEditItem) {
            return handleUpdate()
        }
        setIsSaving(true);
        axios.post(bareUrl + 'todo-items', {
            activity_group_id: id,
            title: textValue,
            priority: dataArray.value
        }).then(response => {
            setIsSaving(false)
            setTextValue('')
            setDataArray({})
            getAllTodos()
            setMessage('Todo berhasil ditambahkan');
            setClassDropdownPriority('hidden');
            addTodoModal.hide()
            successModal.show()
        }).catch(error => {
            setIsSaving(false)
            console.log(error)
        });
    }

    const editTodo = (item) => {

        setIsEditItem(true)
        setEditItem(item)

        var priority = priorities.find((priority) => {
            return priority.value == item.priority
        })

        setTextValue(item.title)
        setDataArray(priority);

        addTodoModal.show()

    }

    const showDeleteTodoModal = (todo) => {

        setTodoId(todo.id)
        setTodoTitle(todo.title)
        setClassDropdownSort('hidden');
        removeTodoModal.show()

    }

    const deleteTodo = () => {

        axios.delete(bareUrl + 'todo-items/' + todoId)
            .then(() => {
                getAllTodos()
                setMessage('Todo berhasil dihapus');
                removeTodoModal.hide()
                successModal.show()
            });

    }

    const closeDeleteModal = () => {
        removeTodoModal.hide()
    }

    const toggleStatus = (item) => {
        axios.patch(bareUrl + 'todo-items/' + item.id, {
            is_active: !item.is_active,
        })
            .then(response => {
                getAllTodos()
                console.log(response)
            })
    }

    const handleUpdate = () => {

        axios.patch(bareUrl + 'todo-items/' + editItem.id, {
            title: textValue,
            priority: dataArray.value
        }).then(response => {
            setIsSaving(false)
            setTextValue('')
            setDataArray({})
            getAllTodos()
            setMessage('Todo berhasil diubah');
            addTodoModal.hide()
            successModal.show()
            setIsEditItem(false)
        }).catch(error => {
            setIsSaving(false)
            console.log(error)
        });

    }

    const updateActivity = () => {

        axios.patch(bareUrl + 'activity-groups/' + id, {
            title: activityTitle,
        })
            .then(response => {
                getActivities()
                setIsEdit(false)
            })

    }

    function handleTitleChange(event) {
        setActivityTitle(event.target.value);
    }

    const displayTitle = () => {

        if (isEdit) {
            return (
                <>
                    <input type="text" autoFocus className="border-0 border-b-2 border-slate-300 focus:border-slate-500 focus:border-0 focus:border-b-2 focus:ring-0 text-3xl px-0 py-2 bg-transparent font-bold" defaultValue={activityTitle} onBlur={() => { updateActivity() }} data-cy="todo-title" onChange={handleTitleChange} />
                    <button data-cy="todo-title-edit-button" className='ml-6' onClick={() => { updateActivity() }}>
                        <img src={iconEdit} alt="icon edit" />
                    </button>
                </>
            )
        } else {
            return (
                <>
                    <div className="text-3xl font-bold py-2 border-b-2 border-transparent" data-cy="todo-title" onClick={() => { setIsEdit(true) }} >
                        {activityTitle}
                    </div>
                    <button data-cy="todo-title-edit-button" className='ml-6' onClick={() => { setIsEdit(true) }}>
                        <img src={iconEdit} alt="icon edit" />
                    </button>
                </>
            )
        }

    }

    useEffect(() => {
        getAllTodos()
        getActivities();
    }, []);

    const removeBackdrop = () => {
        const backdrop = document.querySelectorAll('.modal-backdrop');
        backdrop.forEach(box => {
            box.remove();
        });
    }

    const $addTodoModal = document.getElementById('addTodoModal');
    const addTodoModal = new Modal($addTodoModal, {
        backdropClasses: 'modal-backdrop',
        onHide: () => {
            removeBackdrop()
        },
    });

    const $successModal = document.getElementById('successModal');
    const successModal = new Modal($successModal, {
        backdropClasses: 'modal-backdrop',
        onHide: () => {
            removeBackdrop()
        },
    });

    const $removeTodoModal = document.getElementById('removeTodoModal');
    const removeTodoModal = new Modal($removeTodoModal, {
        closable: true,
        backdropClasses: 'modal-backdrop',
        onHide: () => {
            removeBackdrop()
        },
    });

    return (
        <>
            <section>
                <div className="container mx-auto">
                    <div className="mt-12 flex items-center">
                        <Link to='/'>
                            <div className="mr-2">
                                <img src={iconBack} alt="icon back" data-cy="todo-back-button" />
                            </div>
                        </Link>
                        {displayTitle()}
                        <div className="ml-auto">
                            <div className="flex">
                                <div className="mr-6">
                                    <button id="sortDropdownToggle" onClick={classDropdownSort == 'hidden' ? showDropdownSort : hideDropdownSort} className="h-12 w-12 rounded-full flex items-center justify-center border-slate-200 border-2" data-cy="todo-sort-button" type='button'>
                                        <img src={iconSort} alt="icon sort" />
                                    </button>
                                    {/* <div id="sortDropdown" className={`py-2 text-gray-700 dark:text-gray-200 z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-[200px] ` + (classDropdownSort)}> */}
                                    <ul className={`py-2 text-gray-700 dark:text-gray-200 z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-[200px] ` + (classDropdownSort)} aria-labelledby="sortDropdownToggle" data-cy="sort-parent" id="sortDropdown">
                                        <li data-cy="sort-selection" onClick={() => handleSortOrderChange('newest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                            {/* <button onClick={() => handleSortOrderChange('newest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                            <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                            <div data-cy="sort-selection-title">
                                                Terbaru
                                            </div>

                                            {/* </button> */}
                                        </li>
                                        <li data-cy="sort-selection" onClick={() => handleSortOrderChange('oldest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                            {/* <button onClick={() => handleSortOrderChange('oldest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                            <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                            <div data-cy="sort-selection-title">
                                                Terlama
                                            </div>

                                            {/* </button> */}
                                        </li>
                                        <li data-cy="sort-selection" onClick={() => handleSortOrderChange('asc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                            {/* <button onClick={() => handleSortOrderChange('asc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                            <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                            <div data-cy="sort-selection-title">
                                                A-Z
                                            </div>

                                            {/* </button> */}
                                        </li>
                                        <li data-cy="sort-selection" onClick={() => handleSortOrderChange('desc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                            {/* <button onClick={() => handleSortOrderChange('desc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                            <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                            <div data-cy="sort-selection-title">
                                                Z-A
                                            </div>

                                            {/* </button> */}
                                        </li>
                                        <li data-cy="sort-selection" onClick={() => handleSortOrderChange('unchecked')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                            {/* <button onClick={() => handleSortOrderChange('unchecked')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                            <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                            <div data-cy="sort-selection-title">
                                                Belum Selesai
                                            </div>

                                            {/* </button> */}
                                        </li>
                                    </ul>
                                    {/* </div> */}
                                </div>
                                <button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold" id='todoAddBtn' onClick={handleAddTodo} data-cy="todo-add-button">
                                    <div>
                                        <img src={IconPlus} alt="icon plus" />
                                    </div>
                                    <div className="ml-2">
                                        Tambah
                                    </div>
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-12">
                        {displayTodos(todos)}
                    </div>
                </div>
            </section>

            <div id="addTodoModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full" style={{ zIndex: '999' }}>
                <div className="relative w-full max-w-2xl max-h-full" data-cy={isEditItem ? 'modal-edit' : 'modal-add'}>
                    <div className="relative bg-white rounded-2xl shadow">
                        <div className="flex items-start justify-between p-6 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white" data-cy={isEditItem ? 'modal-edit-title' : 'modal-add-title'}>
                                {isEditItem ? 'Edit List Item' : 'Tambah List Item'}
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={handleCloseAdd} data-cy={isEditItem ? 'modal-edit-close-button' : 'modal-add-close-button'}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-sm font-semibold" data-cy={isEditItem ? 'modal-edit-name-title' : 'modal-add-name-title'}>
                                NAMA LIST ITEM
                            </div>
                            <input type="text" id='addFormTitle' value={textValue} onChange={handleTextChange} className="py-4 px-6 rounded-lg border-2 border-slate-200 w-full mt-2 focus:border-cyan ring-0" placeholder="Tambahkan nama list item" data-cy={isEditItem ? 'modal-edit-name-input' : 'modal-add-name-input'} />
                            <div className="text-sm font-semibold mt-6" data-cy={isEditItem ? 'modal-edit-priority-title' : 'modal-add-priority-title'}>
                                PRIORITY
                            </div>
                            <button id="priotyDropdownToggle" onClick={classDropdownPriority == 'hidden' ? showDropdownPriority : hideDropdownPriority} data-cy={isEditItem ? 'modal-edit-priority-dropdown' : 'modal-add-priority-dropdown'} className="py-4 px-6 rounded-lg border-2 border-slate-200 flex items-center mt-2" type="button">
                                {/* data-dropdown-toggle="priotyDropdown" */}
                                <div className="mr-4">
                                    <div className={`h-3 w-3 rounded-full ` + (dataArray.color == null ? 'bg-red-500' : dataArray.color)}></div>
                                </div>
                                <div>
                                    {dataArray.priority == null ? 'Very High' : dataArray.priority}
                                </div>
                                <div className="ml-3">
                                    <img src={iconAngle} alt="icon angle" />
                                </div>
                            </button>
                            {/* <div id="priotyDropdown" className={`py-2 text-gray-700 dark:text-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-[70] absolute ` + (classDropdownPriority)}> */}
                            <ul className={`py-2 text-gray-700 dark:text-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-[70] absolute ` + (classDropdownPriority)} aria-labelledby="priotyDropdownToggle" id="priotyDropdown">
                                {priorities.map((item, index) => (
                                    <li key={index} data-cy={isEditItem ? 'modal-edit-priority-item' : 'modal-add-priority-item'} onClick={() => handleItemChange(item)} className="block px-6 py-3 hover:bg-gray-100 w-full flex items-center">
                                        {/* <button onClick={() => handleItemChange(item)} className="block px-6 py-3 hover:bg-gray-100 w-full flex items-center"> */}
                                        <div className="mr-4">
                                            <div className={`h-3 w-3 rounded-full ` + item.color}></div>
                                        </div>
                                        <div>
                                            {item.priority}
                                        </div>

                                        {/* </button> */}
                                    </li>
                                ))}
                            </ul>
                            {/* </div> */}
                        </div>
                        <div className="p-6 flex border-t">
                            <div className="ml-auto">
                                <button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold disabled:opacity-50" data-cy={isEditItem ? 'modal-edit-save-button' : 'modal-add-save-button'} disabled={!textValue || isSaving} onClick={handleSave}>
                                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="removeTodoModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
                <div className="relative w-full max-w-2xl max-h-full" data-cy="modal-delete">
                    <div className="relative bg-white rounded-2xl shadow py-6">
                        <div className="p-6 text-center">
                            <img src={iconAlert} alt="icon alert" className="mx-auto" data-cy="modal-delete-icon" />
                            <div className="mt-6" data-cy="modal-delete-title">
                                Apakah anda yakin menghapus todo&nbsp;
                                <span className="font-semibold">
                                    "{todoTitle}"
                                </span>
                                ?
                            </div>
                        </div>
                        <div className="p-6 flex justify-center gap-4">
                            <button className="inline-flex py-3 px-6 bg-slate-100 rounded-full text-slate-500 font-semibold" onClick={() => { closeDeleteModal() }} data-cy="modal-delete-cancel-button">
                                Batal
                            </button>
                            <button className="inline-flex py-3 px-6 bg-red-500 rounded-full text-white font-semibold" onClick={() => { deleteTodo() }} data-cy="modal-delete-confirm-button">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="successModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
                <div className="relative w-full max-w-2xl max-h-full" data-cy="modal-information">
                    <div className="relative bg-white rounded-2xl shadow py-6">
                        <div className="flex items-center px-6">
                            <img src={iconAlertSm} alt="icon alert" data-cy="modal-information-icon" />
                            <div className="ml-4" data-cy="modal-information-title">
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}