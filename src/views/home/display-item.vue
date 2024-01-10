<script setup>
const props = defineProps({
    id: {type: String, required: true},
    isFolder: {type: Boolean, required: true},
    name: {type: String, required: true},
    size: {type: String, default: "-"},
    datetime: {type: String, required: true}
})
const folderRef = ref(null)
const checked = ref(false)

function onClick() {
    checked.value = !checked.value
    if (checked.value) {
        folderRef.value.classList.add("folder--selected")
    } else {
        folderRef.value.classList.remove("folder--selected")
    }
}
</script>

<template>
<div class="folder" ref="folderRef">
    <div class="top">
        <div class="wrapper">
            <NFlex class="content" :size="0" justify="space-between" align="center">
                <div class="select">
                    <NCheckbox :checked="checked" :value="props.id" size="medium" @click="onClick"/>
                </div>
                <div class="wrapper">
                    <NFlex class="action" :size="0" justify="space-between">
                        <img class="icon" src="@/assets/images/share.png" alt="">
                        <img class="icon" src="@/assets/images/download.png" alt="">
                        <img class="icon" src="@/assets/images/more.png" alt="">
                    </NFlex>
                </div>
            </NFlex>
        </div>
    </div>
    <NFlex class="display" :size="0" :vertical="true" justify="start" align="center">
        <img v-if="props.isFolder" class="icon"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUxpcf/MOv/OP//JNP/DKf+4EP/XUP/CKf+6Ff++Hf/RQ//VS//TR//aVf+3Ef+9FP+5A//DJP/fi//14P/ln/+xDf/dZ//ief/Rcf/pvP/GSpk9oQ4AAAAKdFJOUwD////H4/8in2nKcBCgAAAER0lEQVR42u2ai5LbKgyGCyRO4luabb2393/QY5AAgbEtEtxp5/BjY4Ftfb/Y7Uy64cePqqqqqqqqqqqqqr9Xlx0dC79+gt4TGlDN6XYU/tSgull91xu1s2QrQQJ0jIWbTq2EcnrottBdt/sBDm4u+5zfKxgQXYuv/z1Tp8IGThzoSAfnS/kFGM05Yjgumg3gUtTBFdIHmAVZH+OIgY7Pp+u2bpecnwBwgGARlgpof2XrzPz3ct5Kkk0NdGWtwniQJr0Il+IGJsg8dxPEeMGINt2dcgxMySIcdbKxHs39NFGSmZzspI2mifF7gJmhv38X0IOYOO8bIOa/v34V0df35HRjGLDr9jm/GiZaBMHEF70XPvLpDFx5BqD+Hf3+4sutwZlv4O13Qb25tGwDj7eiemQbUJ9FpdgGrOXNBdXH3Nb0AS2Q/UC5a2CFuAFcwoBozveP6BMtewU2UhPGu2WEnGFu+sOzDgb3Kdpo10AaZCgfEQLbAIyQs6pdAzFk4OcuY2A4WP8nAw02F5hBGQNNENjOAAJc4AGeyTXQBDyM4qqww7DBx+F/l/ioE89AQywTFBwwh7nd/ZSGMBxYBvw6Do09B09LZvfjhZWFs30DmxpY88NGBs4KYIJhP9sTenEF/iEDnTlt37lLIQMddoBoKMK0jj4HT+KdfAPdMj/++YjAuw4ZcC7kJ1kGOsJ1C9hgZQlCE2Gtp5SbXQNYS/DusjCHTNa7Vj3XwGpl26l5yjJQBlnUQIZ6e+11CH/rnMNSBnpPoLzesxAYj5430Ls+lTsWFB4OjXYN9Ijo+o1S/LBbsFJeiBgG4jr6Lq7iFeUZOEB/wkA7N+jshB60oFIGWne2kB55COo9MVKGgTauqsVaTB8AVmCu8j7HQJjSlriufsdD7goE8AWoz4I9a+BFBJF82sCTMAOUUuovt2zgbkkTPG9AuqtNKm2MAxgbrI/d92wotgGbW+e1V4llQU4kShz4aKGWRAwD7pXWv2sv5JtDuYVc166BTfsFxDOAP8AixJdXoJAEdkcbENgLiIWbsN2LBgTphEMIC6Yx3jb3iTgGSIIwuSRTcBHCViuEPROSruMYEIKsIg6EryhKu0Kjo7wViJLIRHoZLKtcdZIUywCumIyrklmoFwwcqT9hQJn9F+ZqAmUvuhUxoHxPIBSjhMcGLyiWAfI8JbrSRFiWOUxoNp74DSjCHjjSEcOAogBPoSQY+7QujnF2zu+J2TdgagCS5TgEzCvCIKWKBU4EliDYNaBUgFCkPEGwIp5WKnhzmQYD3grgUtMlTCBU2um29rdwPJWWrf0dBFd1qPa/vL68injg1q/0BjDGJo5TDiO1x2xFZmsYZ9/XJdjCls94rG87Y+54um0AMP/jzt3v9VM3J+ZWolvWXrZxDCHrGtlb/y7nGMFlbOmUs+Pscj3/LCrmNqqsTa05qluEq6qqqqqqqqqq/mL9B15hMo40ijfcAAAAAElFTkSuQmCC"
             alt="">
        <img v-else class="icon"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUxpcdDU2cTI0cvO1NXc4M7Z28zO1dTZ3tfc4NLW3M7S2PX29+zv8f3+/uTo6rW7yDt8+rwAAAAGdFJOUwBA+ZqiJeqKMf8AAARDSURBVGje7Zg/b+REGMazOtJfhShRJCy6nAQf4CQQokR0lKzQwLngpDvEeGiQrsAmoGuQcGZ0OtFgxVPcF7B3+5N9+wWsUFAlJNoiBZThfd8Z7+aPMzO3gc6P1/Z6/D6/93l9f6T11taoUaNGjfofNXn/w+v64G6w/85+NqS9UML2QTasvU/CAJ9lN+n32wUIjfBGlqW9I0noSJ/gCG+Z8oS2nmFw2XchET42tUlqCSlsSR8lJMJ+CgaOY4ArTc04nOxpSIRt6JagDzaeWg4A4Rse/BEmJgDHfmmS2nnsJBl/5AeQKaVPQl0TSpPRlyx92w/Axwe9EwxBNJ6kGAkGg5m8ESYci+0GloRzYHHwc1TijTBJeS9IkRAB3MaO9574E6R9rQljLpIV9r4XgIY+x8q31jcBALfu3xbwOBAgbiTcCwIInt8E+s0LkFzkAoyAECt/jks5rv3iBuQ5tbZmyXMJrpwbL1xx8cgNEGSBUkE+Y0OjNAxY9IwgwC8hMKCEkJgjx4lwOTeTuP5XmAgTl4bun2EuqLuwJ3nXCcAelFqiIzltqkUqe6igAT0A7CqkgEKZ75/MDrtuTr1xrDyXgrsTcAleyAAn+IAf1M2Rhs1xkQsnQEIpCUrlc/ID4dguGnkAF3RyaDW3C/nrAfZnPaD7caMEzw5XerkR4Kc1YL4JQL1aA/4oXx+g5GwN6DZIoPKLgD0FRFki1wdQCmoV1B5cAiCzDEigbJdSJk9n3aFlzLqjVJYlfEp/AklFEv4Vgb/rZrOqA1JVLwSRYXcDoA8G+LmqyErqZhVogf1VqXwjKK3K8nlVmea0wRlUHRNaewCQQEt1AjbQyo8X1bzUSmtZegC6VPpFZexX9JeGBMoN0Cj1rBrUyxICaO0GwF8DpU+GAQtg61J7E5S6ofqmauhYVbW5rOmmH6DLpq7rpqkrONVV0zS4w1qr6LYfcNCSua2blYhT74UB1FdtjVuvpjV73f5At/0JvmyJsFJt9/bbwGfw4BSrGzTVeG7NZdv+in8MHkAJLdhpO6gFC3yI0+Uw4CgKBbwYjLA4Dga8u1wM6UkooIiWp2ut/MudOBSw+/XydLlYLmHHo9WfZ6EAPf376fKajh5GuggEsN1/sqv+7PszeARFCCDWbOc8Sq78bHx4vhPjCIUHEGOPeLp7fk0YQBfMm6AA6eI64SxiDOixNwGDCEVcTHcuK4pYbPxuAERkrIihGRsS3PQAwFhAfxiCIaTHxLgMAn/MnAAoXLk0M0H0OgEimC+BZpjAGkz/y3O4AW7FtwUEJigGG/8nI4yAAMB2CMD5JiXy+6fO374fOa10/MIJePOKJ7L72s8+d78Kw7ppX2ztuBLZiylz//7fjmwzsACE9osjAMHzNurTSxabY2rteH7H9y7LNgZIFJkY5rs9+wJsbd2Jbnr89O1ewEvZ9xwKfzc7atSoUaM20L8RlnifTH3c0wAAAABJRU5ErkJggg=="
             alt="">
        <span class="name">{{props.name}}</span>
        <span v-if="props.isFolder" class="desc">{{props.datetime}}</span>
        <span v-else class="desc">{{props.size}}</span>
    </NFlex>
</div>
</template>

<style scoped lang="scss">
.folder {
    --top-content-wrapper-display: none;
    --action-wrapper-display: none;

    width: 128px;
    padding: 4px;
    border-radius: 8px;
    user-select: none;

    &:hover {
        cursor: pointer;
        background-color: #f7f9fc;
        --top-content-wrapper-display: normal;
        --action-wrapper-display: normal;
    }

    &--selected {
        --top-content-wrapper-display: normal;
        background-color: #f2faff !important;
    }

    .top {
        height: 26px;

        & > .wrapper {
            width: 100%;
            height: 100%;
            display: var(--top-content-wrapper-display);

            .content {
                width: 100%;
                height: 100%;

                & > .wrapper {
                    display: var(--action-wrapper-display);

                    .action {
                        width: 64px;
                        background-color: white;
                        border-radius: 4px;
                        padding: 2px;

                        img {
                            height: 16px;
                            width: 16px;
                        }
                    }
                }
            }
        }
    }

    .display {
        height: 132px;
        padding: 2px 8px 0;

        .icon {
            height: 60px;
            width: 60px;
        }

        .name {
            font-size: 12px;
            color: #03081a;
            margin-top: 8px;

            &:hover {
                color: #06a7ff;
            }
        }

        .desc {
            font-size: 12px;
            color: #818999;
            margin-top: 2px;
        }
    }
}
</style>